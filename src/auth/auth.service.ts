import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   */
  async register(
    email: string,
    password: string,
    nickname: string,
  ): Promise<User> {
    const hashedPassword = await argon2.hash(password);
    return this.userService.createUser(email, nickname, hashedPassword);
  }

  /**
   * Authenticate user (login)
   */
  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userService.findByEmail(email);
    if (!user || !user.password_hash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await argon2.verify(user.password_hash, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  /**
   * Create a guest session
   */
  async createGuest(nickname: string): Promise<{ accessToken: string }> {
    const guest = await this.userService.createGuest(nickname);

    const payload = { sub: guest.id, isGuest: true };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '24h', // Match guest expiration logic
    });

    return { accessToken };
  }

  /**
   * Validate guest session
   */
  async validateGuestSession(userId: string): Promise<void> {
    await this.userService.validateGuestSession(userId);
  }

  /**
   * Validate user by JWT
   */
  async validateUser(userId: string): Promise<User> {
    return this.userService.findById(userId);
  }
}
