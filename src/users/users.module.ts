import { BlockedUserController } from './presentation/controllers/blocked-user.controller';
import { BlockUserHandler } from './application/commands/block-user.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { GetBlockedUsersHandler } from './application/queries/get-blocked-users.handler';
import { GetProfileByUserIdHandler } from './application/queries/get-profile-by-userId.handler';
import { GetUserByIdHandler } from './application/queries/get-user-by-id.handler';
import { LookupsModule } from 'src/lookups/lookups.module';
import { Module } from '@nestjs/common';
import { Profile } from './domain/entities/profile.entity';
import { ProfileController } from './presentation/controllers/profile.controller';
import { ProfileService } from './application/services/profile.service';
import { RedisModule } from 'src/app/infrastructure/redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnblockUserHandler } from './application/commands/unblock-user.handler';
import { UpdateProfileHandler } from './application/commands/update-profile.handler';
import { User } from './domain/entities/user.entity';
import { UsersController } from './presentation/controllers/users.controller';
import { UsersService } from './application/services/user.service';
import { UserBlockingService } from './application/services/user-blocking.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    CqrsModule,
    LookupsModule,
    RedisModule,
  ],
  controllers: [UsersController, ProfileController, BlockedUserController],
  providers: [
    UserBlockingService,
    BlockUserHandler,
    GetBlockedUsersHandler,
    GetProfileByUserIdHandler,
    GetUserByIdHandler,
    ProfileService,
    UnblockUserHandler,
    UpdateProfileHandler,
    UsersService,
  ],
  exports: [UsersService, UserBlockingService],
})
export class UsersModule {}
