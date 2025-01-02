import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Create a new guest user
   */
  async createGuest(nickname: string): Promise<User> {
    const guestUser = this.userRepository.create({
      nickname,
      is_guest: true,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expiration in 24 hours
    });
    return this.userRepository.save(guestUser);
  }

  /**
   * Register a new user
   */
  async createUser(
    email: string,
    nickname: string,
    passwordHash: string,
  ): Promise<User> {
    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create a new registered user
    const newUser = this.userRepository.create({
      email,
      password_hash: passwordHash,
      nickname,
      is_guest: false,
      expires_at: null, // No expiration for registered users
    });

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
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
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
