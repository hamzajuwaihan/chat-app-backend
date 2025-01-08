import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Message } from '../../domain/entities/message.entity';
import { GetMessagesQuery } from './get-message.query';
import { MessagesService } from '../services/messages.service';

@QueryHandler(GetMessagesQuery)
export class GetMessagesHandler implements IQueryHandler<GetMessagesQuery> {
  constructor(private readonly messagesService: MessagesService) {}

  async execute(query: GetMessagesQuery): Promise<Message[]> {
    const { senderId, receiverId, before, limit } = query;

    return await this.messagesService.findAllBetweenUsers(
      senderId,
      receiverId,
      before,
      limit,
    );
  }
}
