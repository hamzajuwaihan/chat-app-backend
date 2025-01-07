import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserService } from 'src/user/application/services/user.service';
import { SendMessageCommand } from './commands/send-message.command';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetRecentMessagesQuery } from './queries/get-recent-messages.query';
import { JwtService } from '@nestjs/jwt';
import { FetchRecentMessagesDto } from './dto/fetch-recent-messages.dto';
import { RedisService } from 'src/redis/redis.service';
import { BlockedUserService } from 'src/blocked-user/blocked-user.service';
import { WsAuthGuard } from 'src/auth/presentation/guards/ws-auth.guard';
import { UseGuards, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // ✅ Fixed missing import
import { BaseWsGateway } from 'src/shared/websockets/BaseWsGateway';

@WebSocketGateway({ cors: { origin: '*' }, namespace: 'private-messages' })
export class MessagesGateway
  extends BaseWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly userService: UserService,
    private readonly queryBus: QueryBus,
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly blockedUserService: BlockedUserService,
  ) {
    super(jwtService, configService);
  }

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket): Promise<void> {
    try {
      const userId = client.data.user?.sub;
      if (!userId) {
        client.disconnect();
        return;
      }

      client.join(userId);
      Logger.log(`MessagesGateway: User connected ${userId}`);

      const blockedUsers =
        await this.blockedUserService.getBlockedUsers(userId);
      const blockedUserIds = blockedUsers.map((user) => user.blocked.id);

      await this.redisService.addMultipleToSet(
        `blocked:${userId}`,
        blockedUserIds,
      );
    } catch (error) {
      Logger.error(`WebSocket Connection Error: ${error.message}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const userId = client.data.user?.sub;
    if (userId) {
      this.server.to(userId).emit('userDisconnected', { userId });
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('fetchRecentMessages')
  async handleFetchRecentMessages(
    @MessageBody() data: FetchRecentMessagesDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const senderId = client.data.user.sub;
    const { receiverId, limit = 10 } = data;

    try {
      const messages = await this.queryBus.execute(
        new GetRecentMessagesQuery(senderId, receiverId, limit),
      );

      client.emit('recentMessages', messages);
    } catch (error) {
      Logger.error('WebSocket Error:', error.message);
      throw new WsException(error.message || 'Failed to fetch messages');
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const senderId = client.data.user.sub;
      const { receiverId, text } = createMessageDto;

      const isBlocked = await this.redisService.isMemberOfSet(
        `blocked:${receiverId}`,
        senderId,
      );
      if (isBlocked) {
        throw new WsException('You are blocked by this user');
      }

      await this.commandBus.execute(
        new SendMessageCommand(senderId, receiverId, text),
      );

      this.server
        .to(receiverId)
        .emit('receiveMessage', { senderId, receiverId, text });
      client.emit('messageSent', {
        status: 'success',
        senderId,
        receiverId,
        text,
      });
    } catch (error) {
      Logger.error('WebSocket Error:', error.message);
      throw new WsException(error.message || 'Message sending failed');
    }
  }
}
