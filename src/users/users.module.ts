import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from './users.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { GetUserByIdHandler } from './queries/get-user-by-id.handler';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CqrsModule],
  controllers: [UsersController],
  providers: [UserService, GetUserByIdHandler],
  exports: [UserService],
})
export class UsersModule {}
