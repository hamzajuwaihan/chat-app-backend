import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient<Socket>();
    this.validateToken(client);
    return true;
  }

  private validateToken(client: Socket) {
    try {
      const token = client.data.user?.token || client.handshake.auth?.token;

      if (!token) {
        Logger.warn(`Unauthorized WebSocket request: Missing token`);
        client.disconnect();
        throw new WsException('Unauthorized: Missing token');
      }

      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      const decoded = this.jwtService.verify(token, { secret: jwtSecret });

      if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
        Logger.warn(`Unauthorized WebSocket request: Token expired`);
        client.emit('authError', { message: 'Token expired' });
        client.disconnect();
        throw new WsException('Unauthorized: Token expired');
      }

      client.data.user = { ...decoded, token };
    } catch (error) {
      Logger.error(`WebSocket Event Authorization Failed: ${error.message}`);
      client.emit('authError', { message: error.message || 'Invalid token' });
      client.disconnect();
      throw new WsException(
        `Unauthorized: ${error.message || 'Invalid token'}`,
      );
    }
  }
}
