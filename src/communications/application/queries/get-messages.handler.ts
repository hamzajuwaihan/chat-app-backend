import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { PrivateMessage } from '../../domain/entities/private-message.entity';
import { GetMessagesQuery } from './get-message.query';
import { PrivateMessagesService } from '../services/private-message.service';

@QueryHandler(GetMessagesQuery)
export class GetMessagesHandler implements IQueryHandler<GetMessagesQuery> {
  constructor(private readonly messagesService: PrivateMessagesService) {}

  async execute(query: GetMessagesQuery): Promise<PrivateMessage[]> {
    const { senderId, receiverId, before, limit } = query;

    return await this.messagesService.findAllBetweenUsers(
      senderId,
      receiverId,
      before,
      limit,
    );
  }
}
