import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnblockUserCommand } from '../commands/unblock-user.command';
import { BlockedUserService } from '../blocked-user.service';
import { RedisService } from 'src/redis/redis.service';
import { MessagesGateway } from 'src/messages/messages.gateway';

@CommandHandler(UnblockUserCommand)
export class UnblockUserHandler implements ICommandHandler<UnblockUserCommand> {
  constructor(
    private readonly blockedUserService: BlockedUserService,
    private readonly redisService: RedisService,
    private readonly messagesGateway: MessagesGateway,
  ) {}

  async execute(command: UnblockUserCommand): Promise<void> {
    const { blockerId, blockedId } = command;

    await this.blockedUserService.unblockUser(blockerId, blockedId);

    await this.redisService.removeFromSet(`blocked:${blockerId}`, blockedId);

    this.messagesGateway.server
      .to(blockerId)
      .emit('userUnblocked', { blockerId, blockedId });
  }
}
