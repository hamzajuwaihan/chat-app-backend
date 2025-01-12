import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { ProfileService } from './profile.service';
import Sqids from 'sqids';

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
  async createGuest(user: User): Promise<User> {
    const sqids = new Sqids({
      alphabet: 'abcdefghijklmnopqrstuvwxyz0123456789',
    });

    const count = await this.userRepository
      .createQueryBuilder()
      .where('nickname LIKE :name', { name: `${user.nickname}%` })
      .getCount();

    let finalNickname = user.nickname;

    if (count !== 0) {
      const timestamp = Math.floor(Date.now() / 1000);
      const randomValue = Math.floor(Math.random() * 1000);
      const uniqueSuffix = sqids.encode([timestamp, randomValue]);
      finalNickname = `${user.nickname}${uniqueSuffix}`;
    }

    const guestUser = this.userRepository.create({
      nickname: finalNickname,
      is_guest: true,
      profile: user.profile,
    });
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
    const user = await this.userRepository.findOneOrFail({
      where: { id },
      relations: {
        profile: true,
      },
    });
    return user;
  }
}
