import { IQuery } from '@nestjs/cqrs';

export class GetMessagesQuery implements IQuery {
  constructor(
    public readonly senderId: string,
    public readonly receiverId: string,
    public readonly before?: string,
    public readonly limit: number = 20,
  ) {}
}
