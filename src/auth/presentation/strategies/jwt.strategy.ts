import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisService } from 'src/app/infrastructure/redis/redis.service';
import { UsersService } from 'src/users/application/services/user.service';
import { User } from 'src/users/domain/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }

    const tokenExists = await this.redisService.get(`refresh_token:${user.id}`);

    if (!tokenExists) {
      throw new UnauthorizedException(
        'Token has been revoked. Please log in again.',
      );
    }
    delete user['password_hash'];
    return user;
  }
}
