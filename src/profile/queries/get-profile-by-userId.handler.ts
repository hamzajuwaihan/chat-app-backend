import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProfileByUserIdQuery } from './get-profile-by-userId.query';
import { ProfileService } from '../profile.service';
import { Profile } from '../entities/profile.entity';

@QueryHandler(GetProfileByUserIdQuery)
export class GetProfileByUserIdHandler
  implements IQueryHandler<GetProfileByUserIdQuery>
{
  constructor(private readonly profileService: ProfileService) {}

  async execute(query: GetProfileByUserIdQuery): Promise<Profile> {
    return await this.profileService.getProfileByUserId(query.userId);
  }
}
