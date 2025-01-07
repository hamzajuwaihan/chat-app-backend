import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlockUserCommand } from '../commands/block-user.command';
import { BlockedUserService } from '../blocked-user.service';
import { RedisService } from 'src/redis/redis.service';
import { MessagesGateway } from 'src/messages/messages.gateway';
//TODO: Needs to unify emit event name
@CommandHandler(BlockUserCommand)
export class BlockUserHandler implements ICommandHandler<BlockUserCommand> {
  constructor(
    private readonly blockedUserService: BlockedUserService,
    private readonly redisService: RedisService,
    private readonly messagesGateway: MessagesGateway,
  ) {}

  async execute(command: BlockUserCommand): Promise<void> {
    const { blockerId, blockedId } = command;
    console.log('blockerId>>>1111>>>>>>>>', blockerId);
    const isAlreadyBlocked = await this.redisService.isMemberOfSet(
      `blocked:${blockerId}`,
      blockedId,
    );
    if (isAlreadyBlocked) {
      return;
    }

    await this.blockedUserService.blockUser(blockerId, blockedId);

    await this.redisService.addToSet(`blocked:${blockerId}`, blockedId);
    console.log('blockerId>>>>>>>>>>>', blockerId);
    this.messagesGateway.server
      .to(blockerId)
      .emit('userBlocked', { blockerId, blockedId });
  }
}
