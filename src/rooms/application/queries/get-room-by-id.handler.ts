import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRoomByIdQuery } from './get-room-by-id-query';
import { RoomService } from '../services/room.service';

@QueryHandler(GetRoomByIdQuery)
export class GetRoomByIdHandler implements IQueryHandler {
  constructor(private readonly roomService: RoomService) {}
  async execute(query: any): Promise<any> {
    return await this.roomService.getRoomById(query.id);
  }
}
