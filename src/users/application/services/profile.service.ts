import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/users/domain/entities/profile.entity';
import {
  PermissionType,
  PrivacySettingType,
} from 'src/users/domain/shared/enumerations';
import { EventBus } from '@nestjs/cqrs';
import { PrivacySettingsUpdatedEvent } from '../events/privacy-settings-update.event';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly eventBus: EventBus,
  ) {}

  create() {
    const profile = this.profileRepository.create({});
    return this.profileRepository.save(profile);
  }

  async getProfileByUserId(userId: string): Promise<Profile | null> {
    return this.profileRepository.findOneOrFail({
      where: { user: { id: userId } },
      relations: {
        country: true,
      },
    });
  }

  async update(
    userId: string,
    profileData: Partial<Profile>,
  ): Promise<Profile> {
    const profile = await this.getProfileByUserId(userId);

    const previousPrivacySettings = profile.privacySettings || {};
    const newPrivacySettings = profileData.privacySettings || {};

    const permissionMapping: Record<string, PermissionType> = {
      allowPrivateMessages: PermissionType.PRIVATE_MESSAGES,
      mediaReception: PermissionType.MEDIA_RECEPTION,
    };

    const permissionsToRemove: PermissionType[] = [];

    for (const [key, permissionType] of Object.entries(permissionMapping)) {
      if (
        (previousPrivacySettings[key] as PrivacySettingType) ===
          PrivacySettingType.SPECIFIC_USERS &&
        (newPrivacySettings[key] as PrivacySettingType) !==
          PrivacySettingType.SPECIFIC_USERS
      ) {
        permissionsToRemove.push(permissionType);
      }
    }

    if (profileData.privacySettings) {
      profileData.privacySettings = {
        ...profile.privacySettings,
        ...profileData.privacySettings,
      };
    }

    Object.assign(profile, profileData);

    const updatedProfile = await this.profileRepository.save(profile);

    if (permissionsToRemove.length > 0) {
      this.eventBus.publish(
        new PrivacySettingsUpdatedEvent(userId, permissionsToRemove),
      );
    }

    return updatedProfile;
  }
}
