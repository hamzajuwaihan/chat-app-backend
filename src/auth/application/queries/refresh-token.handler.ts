import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from 'src/app/infrastructure/cache/cache.service';
import { RefreshTokenQuery } from './refresh-token.query';
import { UnauthorizedException } from '@nestjs/common';

@QueryHandler(RefreshTokenQuery)
export class RefreshTokenHandler implements IQueryHandler<RefreshTokenQuery> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
  ) {}

  async execute(query: RefreshTokenQuery): Promise<{ accessToken: string }> {
    const { refreshToken } = query;

    let payload;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const storedToken = await this.cacheService.get(
      `refresh_token:${payload.sub}`,
    );
    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newAccessToken = await this.jwtService.signAsync({
      sub: payload.sub,
      email: payload.email,
    });

    return { accessToken: newAccessToken };
  }
}
