import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBlockedUsersQuery } from '../queries/get-blocked-users.query';
import { BlockedUserService } from '../blocked-user.service';

@QueryHandler(GetBlockedUsersQuery)
export class GetBlockedUsersHandler
  implements IQueryHandler<GetBlockedUsersQuery>
{
  constructor(private readonly blockedUserService: BlockedUserService) {}

  async execute(query: GetBlockedUsersQuery): Promise<any> {
    return await this.blockedUserService.getBlockedUsers(query.userId);
  }
}
