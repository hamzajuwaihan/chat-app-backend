import { IQuery } from '@nestjs/cqrs';

export class RefreshTokenQuery implements IQuery {
  constructor(public readonly refreshToken: string) {}
}
