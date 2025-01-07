import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/user/domain/entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  create() {
    const profile = this.profileRepository.create({});
    return this.profileRepository.save(profile);
  }

  async getProfileByUserId(userId: string): Promise<Profile | null> {
    return this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: {
        country: true,
      },
    });
  }
  async update(profile: Profile) {
    const updatedProfile = await this.profileRepository.save(profile);
    return await this.profileRepository.findOne({
      where: { id: updatedProfile.id },
      relations: ['country'],
    });
  }
}
