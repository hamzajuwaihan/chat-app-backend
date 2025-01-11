import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './logout.command';
import { CacheService } from 'src/app/infrastructure/cache/cache.service';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly cacheService: CacheService) {}

  async execute(command: LogoutCommand): Promise<{ message: string }> {
    const { userId } = command;

    const tokenExists = await this.cacheService.get(`refresh_token:${userId}`);

    if (!tokenExists) {
      return { message: 'Token already revoked or does not exist' };
    }

    await this.cacheService.del(`refresh_token:${userId}`);

    return { message: 'Successfully logged out' };
  }
}
