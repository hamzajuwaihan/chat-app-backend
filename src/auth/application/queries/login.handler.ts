import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { LoginQuery } from './login.query';
import { RedisService } from 'src/app/infrastructure/redis/redis.service';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/application/services/user.service';
import * as argon2 from 'argon2';

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 300;

@QueryHandler(LoginQuery)
export class LoginHandler implements IQueryHandler<LoginQuery> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly usersService: UsersService,
  ) {}

  async execute(
    query: LoginQuery,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = query;

    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const lockKey = `failed_attempts:${user.id}`;
    const attempts = await this.redisService.get(lockKey);

    if (attempts && parseInt(attempts) >= MAX_ATTEMPTS) {
      throw new UnauthorizedException('Account locked. Try again later.');
    }

    const isPasswordValid = await argon2.verify(user.password_hash, password);
    if (!isPasswordValid) {
      await this.redisService.set(
        lockKey,
        ((parseInt(attempts) || 0) + 1).toString(),
        LOCK_TIME,
      );
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.redisService.del(lockKey);

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    await this.redisService.set(
      `refresh_token:${user.id}`,
      refreshToken,
      604800,
    );

    return { accessToken, refreshToken };
  }
}