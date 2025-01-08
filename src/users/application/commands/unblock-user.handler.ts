import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UnblockUserCommand } from './unblock-user.command';
import { RedisService } from 'src/app/infrastructure/redis/redis.service';
import { UserBlockingService } from '../services/user-blocking.service';
import { UserUnBlockedEvent } from '../events/user-unblocked.event';

@CommandHandler(UnblockUserCommand)
export class UnblockUserHandler implements ICommandHandler<UnblockUserCommand> {
  constructor(
    private readonly userBlockingService: UserBlockingService,
    private readonly redisService: RedisService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UnblockUserCommand): Promise<void> {
    const { blockerId, blockedId } = command;

    await this.userBlockingService.unblockUser(blockerId, blockedId);
    await this.redisService.removeFromSet(`blocked:${blockerId}`, blockedId);

    this.eventBus.publish(new UserUnBlockedEvent(blockerId, blockedId));
  }
}
