import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RoomService } from '../services/room.service';
import { Room } from 'src/rooms/domain/entities/room.entity';
import { GetAllRoomsQuery } from './get-all-rooms.query';

@QueryHandler(GetAllRoomsQuery)
export class GetAllRoomsHandler implements IQueryHandler {
  constructor(private readonly roomService: RoomService) {}

  async execute(): Promise<Room[]> {
    return await this.roomService.getAllRooms();
  }
}
