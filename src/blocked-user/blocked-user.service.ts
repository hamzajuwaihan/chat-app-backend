import { Injectable } from '@nestjs/common';
import { BlockedUser } from './entities/blocked-user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BlockedUserService {
  constructor(
    @InjectRepository(BlockedUser)
    private readonly blockedUserRepo: Repository<BlockedUser>,
  ) {}

  async blockUser(blockerId: string, blockedId: string): Promise<void> {
    const existingBlock = await this.blockedUserRepo.findOne({
      where: { blocker: { id: blockerId }, blocked: { id: blockedId } },
    });

    if (!existingBlock) {
      const blockEntry = this.blockedUserRepo.create({
        blocker: { id: blockerId },
        blocked: { id: blockedId },
      });
      await this.blockedUserRepo.save(blockEntry);
    }
  }

  async unblockUser(blockerId: string, blockedId: string): Promise<void> {
    await this.blockedUserRepo.delete({
      blocker: { id: blockerId },
      blocked: { id: blockedId },
    });
  }

  async isUserBlocked(blockerId: string, blockedId: string): Promise<boolean> {
    return !!(await this.blockedUserRepo.count({
      where: { blocker: { id: blockerId }, blocked: { id: blockedId } },
    }));
  }

  async getBlockedUsers(userId: string): Promise<BlockedUser[]> {
    return this.blockedUserRepo.find({
      where: { blocker: { id: userId } },
      relations: ['blocked'],
    });
  }
}
