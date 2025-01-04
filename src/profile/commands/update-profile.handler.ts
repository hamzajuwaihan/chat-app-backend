import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Profile } from '../entities/profile.entity';
import { UpdateProfileCommand } from './update-profile.command';
import { ProfileService } from '../profile.service';
import { CountryService } from 'src/country/country.service';

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

    const profile = await this.profileService.getProfileByUserId(userId);

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Use DTO properties directly
    Object.assign(profile, updateProfileDto);

    if (updateProfileDto.countryId) {
      const country = await this.countryService.findOne(
        updateProfileDto.countryId,
      );
      profile.country = country || null;
    }

    return await this.profileService.update(profile);
  }
}
