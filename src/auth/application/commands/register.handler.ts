import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from 'src/users/application/services/user.service';
import { RegisterCommand } from './register.command';
import { CacheService } from 'src/app/infrastructure/cache/cache.service';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
  ) {}

  async execute(
    command: RegisterCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password, nickname } = command;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = await this.usersService.createUser({
      email,
      password_hash: hashedPassword,
      nickname,
      is_guest: false,
      expires_at: null,
    });

    const payload = { sub: newUser.id, email: newUser.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    await this.cacheService.set(
      `refresh_token:${newUser.id}`,
      refreshToken,
      604800,
    );

    return { accessToken, refreshToken };
  }
}
