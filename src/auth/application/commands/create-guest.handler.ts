import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { CreateGuestCommand } from './create-guest.command';
import { CacheService } from 'src/app/infrastructure/cache/cache.service';
import { AuthService } from '../services/auth.service';

@CommandHandler(CreateGuestCommand)
export class CreateGuestHandler implements ICommandHandler<CreateGuestCommand> {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
  ) {}

  async execute(
    command: CreateGuestCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { user } = command;

    const guest = await this.authService.createGuest(user);

    const payload = {
      sub: guest.id,
      isGuest: true,
      nickname: guest.nickname,
      profile: {
        gender: guest.profile.gender,
        status: guest.profile.status,
      },
      createdAt: guest.createdAt,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '3d',
    });

    await this.cacheService.set(
      `refresh_token:${guest.id}`,
      refreshToken,
      259200,
    );

    return { accessToken, refreshToken };
  }
}
