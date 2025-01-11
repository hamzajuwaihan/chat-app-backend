import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Profile } from '../../domain/entities/profile.entity';
import { UpdateProfileCommand } from './update-profile.command';
import { CountryService } from 'src/lookups/application/services/country.service';
import { ProfileService } from '../services/profile.service';
import { plainToInstance } from 'class-transformer';
import { UserStatus } from 'src/users/domain/shared/enumerations';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler
  implements ICommandHandler<UpdateProfileCommand>
{
  constructor(
    private readonly profileService: ProfileService,
    private readonly countryService: CountryService,
  ) {}

  async execute(command: UpdateProfileCommand): Promise<Profile> {
    const { userId, updateProfileDto } = command;

    const profile = plainToInstance(Profile, updateProfileDto);

    if (updateProfileDto.status) {
      profile.status = updateProfileDto.status as unknown as UserStatus;
    }

    if (updateProfileDto.countryId) {
      const country = await this.countryService.findOne(
        updateProfileDto.countryId,
      );
      profile.country = country || null;
    }

    return await this.profileService.update(userId, profile);
  }
}
