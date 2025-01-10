import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/domain/entities/user.entity';

@Injectable()
export class UserBlockingService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async blockUser(blockerId: string, blockedId: string): Promise<boolean> {
    if (blockerId === blockedId) return false;

    const [blocker, blocked] = await Promise.all([
      this.userRepo.findOne({
        where: { id: blockerId },
        relations: ['blockedUsers'],
      }),
      this.userRepo.findOne({ where: { id: blockedId } }),
    ]);

    if (!blocker || !blocked) return false;

    if (!blocker.blockedUsers.some((user) => user.id === blockedId)) {
      blocker.blockedUsers.push(blocked);
      await this.userRepo.save(blocker);
      return true;
    }

    return false;
  }

  async unblockUser(blockerId: string, blockedId: string): Promise<boolean> {
    const blocker = await this.userRepo.findOne({
      where: { id: blockerId },
      relations: ['blockedUsers'],
    });

    if (!blocker) return false;

    blocker.blockedUsers = blocker.blockedUsers.filter(
      (user) => user.id !== blockedId,
    );
    await this.userRepo.save(blocker);
    return true;
  }

  async isUserBlocked(blockerId: string, blockedId: string): Promise<boolean> {
    const count = await this.userRepo
      .createQueryBuilder('user')
      .leftJoin('user.blockedUsers', 'blocked')
      .where('user.id = :blockerId AND blocked.id = :blockedId', {
        blockerId,
        blockedId,
      })
      .getCount();

    return count > 0;
  }

  async getBlockedUsers(
    userId: string,
  ): Promise<Pick<User, 'id' | 'nickname'>[]> {
    //FIXME: switch to findOneOrFail and handle EntityNotFoundError in an exception handler/filter or return empty array
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['blockedUsers'],
      select: ['id'],
    });

    return (
      user?.blockedUsers.map(({ id, nickname }) => ({ id, nickname })) || []
    );
  }
}
