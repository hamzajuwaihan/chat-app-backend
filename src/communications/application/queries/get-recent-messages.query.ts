import { IQuery } from '@nestjs/cqrs';

export class GetRecentMessagesQuery implements IQuery {
  constructor(
    public readonly senderId: string,
    public readonly receiverId: string,
    public readonly limit: number = 10,
  ) {}
}
