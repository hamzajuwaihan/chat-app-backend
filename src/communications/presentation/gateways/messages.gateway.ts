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
import { CreateMessageDto } from '../dto/create-message.dto';
import { GetRecentMessagesQuery } from '../../application/queries/get-recent-messages.query';
import { JwtService } from '@nestjs/jwt';
import { FetchRecentMessagesDto } from '../dto/fetch-recent-messages.dto';
import { RedisService } from 'src/app/infrastructure/redis/redis.service';
import { WsAuthGuard } from 'src/communications/presentation/guards/ws-auth.guard';
import { UseGuards, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseWsGateway } from 'src/communications/infrastructure/websockets/BaseWsGateway';
import { UserBlockingService } from 'src/users/application/services/user-blocking.service';
import { SendMessageCommand } from '../../application/commands/send-message.command';

@WebSocketGateway({ cors: { origin: '*' }, namespace: 'private-messages' })
export class MessagesGateway
  extends BaseWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly userBlockingService: UserBlockingService,
  ) {
    super(jwtService, configService);
  }

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket): Promise<void> {
    try {
      const userId = client.data.user?.sub;
      if (!userId) {
        Logger.warn(`Connection rejected: No user ID found`);
        client.disconnect();
        return;
      }

      client.join(userId);
      Logger.log(`MessagesGateway: User connected ${userId}`);

      const blockedUsers =
        await this.userBlockingService.getBlockedUsers(userId);
      const blockedUserIds = blockedUsers.map((user) => user.id);

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
      Logger.error(`Fetch Messages Error: ${error.message}`);
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
      Logger.log(`Emitting message to room: ${receiverId}`);

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
      Logger.error(`Send Message Error: ${error.message}`);
      throw new WsException(error.message || 'Message sending failed');
    }
  }
}
