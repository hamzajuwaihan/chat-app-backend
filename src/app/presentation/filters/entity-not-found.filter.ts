import { Catch, ExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { Response, Request } from 'express';

@Catch(EntityNotFoundError)
export class EntityNotFoundErrorFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const message = exception.message;
    const entityName = message.split(' ')[7];

    Logger.error(
      `Entity not found: ${message}`,
      exception.stack,
      'EntityNotFoundErrorFilter',
    );

    response.status(404).json({
      statusCode: 404,
      message: `Entity of type '${entityName}' not found`,
      error: exception.name,
      path: request.url,
    });
  }
}
