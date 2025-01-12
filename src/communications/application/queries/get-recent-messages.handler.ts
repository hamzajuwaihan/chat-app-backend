import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRecentMessagesQuery } from './get-recent-messages.query';
import { PrivateMessagesService } from '../services/private-message.service';
import { PrivateMessage } from '../../domain/entities/private-message.entity';

@QueryHandler(GetRecentMessagesQuery)
export class GetRecentMessagesHandler
  implements IQueryHandler<GetRecentMessagesQuery>
{
  constructor(private readonly messagesService: PrivateMessagesService) {}

  async execute(query: GetRecentMessagesQuery): Promise<PrivateMessage[]> {
    const { senderId, receiverId, limit } = query;

    return await this.messagesService.findRecentMessages(
      senderId,
      receiverId,
      limit,
    );
  }
}
