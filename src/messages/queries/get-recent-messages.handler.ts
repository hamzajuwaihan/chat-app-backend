import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRecentMessagesQuery } from './get-recent-messages.query';
import { MessagesService } from '../messages.service';
import { Message } from '../entities/message.entity';

@QueryHandler(GetRecentMessagesQuery)
export class GetRecentMessagesHandler
  implements IQueryHandler<GetRecentMessagesQuery>
{
  constructor(private readonly messagesService: MessagesService) {}

  async execute(query: GetRecentMessagesQuery): Promise<Message[]> {
    const { senderId, receiverId, limit } = query;

    return await this.messagesService.findRecentMessages(
      senderId,
      receiverId,
      limit,
    );
  }
}
