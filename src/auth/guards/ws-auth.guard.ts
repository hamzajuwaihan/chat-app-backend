import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = client.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new WsException('Unauthorized: Missing token');
    }

    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      const decoded = this.jwtService.verify(token, { secret: jwtSecret });

      client.data.user = decoded;
      client.join(decoded.sub);
      return true;
    } catch (error) {
      throw new WsException(
        `Unauthorized: ${error.message || 'Invalid token'}`,
      );
    }
  }
}
