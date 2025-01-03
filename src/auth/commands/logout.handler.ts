import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RedisService } from '../../redis/redis.service';
import { LogoutCommand } from './logout.command';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly redisService: RedisService) {}

  async execute(command: LogoutCommand): Promise<{ message: string }> {
    const { userId } = command;

    const tokenExists = await this.redisService.get(`refresh_token:${userId}`);

    if (!tokenExists) {
      return { message: 'Token already revoked or does not exist' };
    }

    await this.redisService.del(`refresh_token:${userId}`);

    return { message: 'Successfully logged out' };
  }
}
