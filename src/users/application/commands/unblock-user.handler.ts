import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UnblockUserCommand } from './unblock-user.command';
import { CacheService } from 'src/app/infrastructure/cache/cache.service';
import { UserBlockingService } from '../services/user-blocking.service';
import { UserUnBlockedEvent } from '../events/user-unblocked.event';

@CommandHandler(UnblockUserCommand)
export class UnblockUserHandler implements ICommandHandler<UnblockUserCommand> {
  constructor(
    private readonly userBlockingService: UserBlockingService,
    private readonly cacheService: CacheService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UnblockUserCommand): Promise<void> {
    const { blockerId, blockedId } = command;

    await this.userBlockingService.unblockUser(blockerId, blockedId);
    await this.cacheService.removeFromSet(`blocked:${blockerId}`, blockedId);

    this.eventBus.publish(new UserUnBlockedEvent(blockerId, blockedId));
  }
}
