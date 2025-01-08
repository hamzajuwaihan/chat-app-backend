import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { User } from 'src/users/domain/entities/user.entity';
import { UsersService } from 'src/users/application/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   */
  async register(user: User): Promise<{ accessToken: string }> {
    user.password_hash = await argon2.hash(user.password_hash);
    const savedUser = await this.usersService.createUser(user);

    const payload = { sub: savedUser.id, email: savedUser.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  /**
   * Authenticate user (login)
   */
  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password_hash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await argon2.verify(user.password_hash, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  /**
   * Create a guest session
   */
  async createGuest(user: User): Promise<{ accessToken: string }> {
    const guest = await this.usersService.createGuest(user.nickname);

    const payload = { sub: guest.id, isGuest: true };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '24h',
    });

    return { accessToken };
  }

  /**
   * Validate guest session
   */
  async validateGuestSession(userId: string): Promise<void> {
    await this.usersService.validateGuestSession(userId);
  }

  /**
   * Validate user by JWT
   */
  async validateUser(userId: string): Promise<User> {
    return await this.usersService.findById(userId);
  }
}
