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
import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { SendMessageCommand } from './commands/send-message.command';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetRecentMessagesQuery } from './queries/get-recent-messages.query';
import { WsExceptionFilter } from 'src/exceptions/ws-exception.filter';
import { WsAuthGuard } from 'src/auth/guards/ws-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { FetchRecentMessagesDto } from './dto/fetch-recent-messages.dto';

@WebSocketGateway({ cors: { origin: '*' } })
@UseFilters(new WsExceptionFilter())
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly userService: UserService,
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        client.disconnect();
        return;
      }

      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      client.data.user = decoded;

      client.join(decoded.sub);
    } catch (error) {
      console.error(`WebSocket Connection Error: ${error.message}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const userId = client.data.user?.sub;
    if (userId) {
      this.server.to(userId).emit('userDisconnected', { userId });
    }
  }

  @SubscribeMessage('fetchRecentMessages')
  @UseGuards(WsAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => new WsException(errors),
    }),
  )
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
      console.error('WebSocket Error:', error.message);
      throw new WsException(error.message || 'Failed to fetch messages');
    }
  }

  @SubscribeMessage('sendMessage')
  @UseGuards(WsAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => new WsException(errors),
    }),
  )
  async handleSendMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const senderId = client.data.user.sub;
      const { receiverId, text } = createMessageDto;

      const senderExists = await this.userService.findById(senderId);
      if (!senderExists) {
        throw new WsException('Unauthorized: Sender removed');
      }

      const receiverExists = await this.userService.findById(receiverId);
      if (!receiverExists) {
        throw new WsException('Failed: Receiver does not exist');
      }

      await this.commandBus.execute(
        new SendMessageCommand(senderId, receiverId, text),
      );

      this.server.to(receiverId).emit('receiveMessage', {
        senderId,
        receiverId,
        text,
      });

      client.emit('messageSent', {
        status: 'success',
        senderId,
        receiverId,
        text,
      });
    } catch (error) {
      console.error('WebSocket Error:', error.message);
      throw new WsException(error.message || 'Message sending failed');
    }
  }
}
