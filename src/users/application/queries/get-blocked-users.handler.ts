import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBlockedUsersQuery } from './get-blocked-users.query';
import { UserBlockingService } from '../services/user-blocking.service';

@QueryHandler(GetBlockedUsersQuery)
export class GetBlockedUsersHandler
  implements IQueryHandler<GetBlockedUsersQuery>
{
  constructor(private readonly userBlockingService: UserBlockingService) {}

  async execute(query: GetBlockedUsersQuery): Promise<any> {
    return this.userBlockingService.getBlockedUsers(query.userId);
  }
}
