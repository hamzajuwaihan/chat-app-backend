import { forwardRef, Module } from '@nestjs/common';
import { BlockedUserService } from './blocked-user.service';
import { BlockedUserController } from './blocked-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockedUser } from './entities/blocked-user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { BlockUserHandler } from './commands/block-user.handler';
import { UnblockUserHandler } from './commands/unblock-user.handler';
import { GetBlockedUsersHandler } from './queries/get-blocked-users.handler';
import { RedisModule } from 'src/redis/redis.module';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlockedUser]),
    CqrsModule,
    RedisModule,
    forwardRef(() => MessagesModule),
  ],
  controllers: [BlockedUserController],
  providers: [
    BlockedUserService,
    BlockUserHandler,
    UnblockUserHandler,
    GetBlockedUsersHandler,
  ],
  exports: [BlockedUserService],
})
export class BlockedUserModule {}
