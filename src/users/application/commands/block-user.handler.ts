import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RedisService } from 'src/app/infrastructure/redis/redis.service';
import { BlockUserCommand } from './block-user.command';
import { UserBlockingService } from '../services/user-blocking.service';
import { UserBlockedEvent } from '../events/user-blocked.event';

@CommandHandler(BlockUserCommand)
export class BlockUserHandler implements ICommandHandler<BlockUserCommand> {
  constructor(
    private readonly userBlockingService: UserBlockingService,
    private readonly redisService: RedisService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: BlockUserCommand): Promise<void> {
    const { blockerId, blockedId } = command;

    if (
      await this.redisService.isMemberOfSet(`blocked:${blockerId}`, blockedId)
    )
      return;

    await this.userBlockingService.blockUser(blockerId, blockedId);
    await this.redisService.addToSet(`blocked:${blockerId}`, blockedId);

    this.eventBus.publish(new UserBlockedEvent(blockerId, blockedId));
  }
}
