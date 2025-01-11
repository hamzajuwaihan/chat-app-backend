import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { ProfileService } from './profile.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly profileService: ProfileService,
  ) {}

  /**
   * Create a new guest user
   */
  async createGuest(nickname: string): Promise<User> {
    const guestUser = this.userRepository.create({
      nickname,
      is_guest: true,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    guestUser.profile = await this.profileService.create();
    return this.userRepository.save(guestUser);
  }

  /**
   * Register a new user
   */

  async createUser(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);
    newUser.profile = await this.profileService.create();
    return this.userRepository.save(newUser);
  }

  /**
   * Get user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * Get user by ID
   */
  //TODO: Either make a new function to return user + profile or do not return profile everytime
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        profile: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Validate guest session
   */
  async validateGuestSession(userId: string): Promise<void> {
    const user = await this.findById(userId);

    if (user.is_guest && user.expires_at && user.expires_at < new Date()) {
      throw new Error('Guest session has expired');
    }
  }
}
