import { Module } from '@nestjs/common';
import { Room } from './domain/entities/room.entity';
import { RoomMembership } from './domain/entities/room-membership.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { GetAllRoomsHandler } from './application/queries/get-all-rooms.handler';
import { RoomsController } from './presentation/controllers/rooms.controller';
import { RoomService } from './application/services/room.service';
import { GetRoomByIdHandler } from './application/queries/get-room-by-id.handler';

@Module({
  imports: [TypeOrmModule.forFeature([RoomMembership, Room]), CqrsModule],
  providers: [GetAllRoomsHandler, RoomService, GetRoomByIdHandler],
  controllers: [RoomsController],
  exports: [TypeOrmModule],
})
export class RoomsModule {}
