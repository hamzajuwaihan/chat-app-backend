import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException)
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const client: Socket = host.switchToWs().getClient<Socket>();
    const errorMessage = exception.getError();

    console.error(`WebSocket Error: ${JSON.stringify(errorMessage)}`);

    client.emit('wsError', {
      message: errorMessage || 'An unknown WebSocket error occurred',
    });
  }
}
