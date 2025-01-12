import { Module } from '@nestjs/common';
import { Room } from './domain/entities/room.entity';
import { RoomMembership } from './domain/entities/room-membership.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { GetAllRoomsHandler } from './application/queries/get-all-rooms.handler';
import { RoomsController } from './presentation/controllers/rooms.controller';
import { RoomService } from './application/services/room.service';
import { GetRoomByIdHandler } from './application/queries/get-room-by-id.handler';
import { GetRoomWithMembersHandler } from './application/queries/get-room-with-members.handler';
import { UsersModule } from 'src/users/users.module';
import { AddUserToRoomHandler } from './application/commands/add-user-to-room.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomMembership, Room]),
    CqrsModule,
    UsersModule,
  ],
  providers: [
    GetAllRoomsHandler,
    RoomService,
    GetRoomByIdHandler,
    GetRoomWithMembersHandler,
    AddUserToRoomHandler,
  ],
  controllers: [RoomsController],
  exports: [TypeOrmModule],
})
export class RoomsModule {}
