import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserService } from 'src/user/user.service';
import { RegisterCommand } from './register.command';
import { RedisService } from 'src/redis/redis.service';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async execute(
    command: RegisterCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password, nickname } = command;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = await this.userService.createUser({
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

    await this.redisService.set(
      `refresh_token:${newUser.id}`,
      refreshToken,
      604800,
    );

    return { accessToken, refreshToken };
  }
}
