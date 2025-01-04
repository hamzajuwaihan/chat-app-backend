import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreateGuestCommand } from './create-guest.command';
import { RedisService } from 'src/redis/redis.service';

@CommandHandler(CreateGuestCommand)
export class CreateGuestHandler implements ICommandHandler<CreateGuestCommand> {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService, // Added RedisService for refresh token storage
  ) {}

  async execute(
    command: CreateGuestCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { nickname } = command;

    const guest = await this.userService.createGuest(nickname);

    const payload = { sub: guest.id, isGuest: true };

    // Access token expires in 3 days (72 hours)
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '72h',
    });

    // Refresh token also expires in 3 days
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '3d',
    });

    await this.redisService.set(
      `refresh_token:${guest.id}`,
      refreshToken,
      259200,
    );

    return { accessToken, refreshToken };
  }
}
