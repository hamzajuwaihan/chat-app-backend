import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { OnGatewayInit } from '@nestjs/websockets';
import { WebSocketGateway, WsException } from '@nestjs/websockets';
import { WsExceptionFilter } from 'src/app/presentation/exceptions/ws-exception.filter';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
@UseFilters(new WsExceptionFilter())
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => new WsException(errors),
  }),
)
export abstract class BaseWsGateway implements OnGatewayInit {
  protected constructor(
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    server.use((client: Socket, next) => {
      try {
        this.validateToken(client);
        next();
      } catch (err) {
        next(err);
      }
    });
  }
  //TODO: Check if user exists in the database
  private validateToken(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        Logger.warn(`WebSocket Authentication Failed: Missing token`);
        client.disconnect();
        return;
      }

      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      const decoded = this.jwtService.verify(token, { secret: jwtSecret });

      if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
        Logger.warn(`WebSocket Authentication Failed: Token expired`);
        client.emit('authError', { message: 'Token expired' });
        client.disconnect();
        return;
      }

      client.data.user = { ...decoded, token };

      Logger.log(`WebSocket User Authenticated: ${decoded.sub}`);
    } catch (error) {
      Logger.error(`WebSocket Authentication Error: ${error.message}`);
      client.emit('authError', { message: error.message || 'Invalid token' });
      client.disconnect();
    }
  }
}
