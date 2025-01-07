import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from './presentation/controllers/users.controller';
import { UserService } from './application/services/user.service';
import { User } from './domain/entities/user.entity';
import { GetUserByIdHandler } from './application/queries/get-user-by-id.handler';
import { Profile } from './domain/entities/profile.entity';
import { LookupsModule } from 'src/lookups/lookups.module';
import { ProfileController } from './presentation/controllers/profile.controller';
import { ProfileService } from './application/services/profile.service';
import { GetProfileByUserIdHandler } from './application/queries/get-profile-by-userId.handler';
import { UpdateProfileHandler } from './application/commands/update-profile.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    CqrsModule,
    LookupsModule,
  ],
  controllers: [UsersController, ProfileController],
  providers: [
    UserService,
    GetUserByIdHandler,
    ProfileService,
    GetProfileByUserIdHandler,
    UpdateProfileHandler,
  ],
  exports: [UserService],
})
export class UsersModule {}
