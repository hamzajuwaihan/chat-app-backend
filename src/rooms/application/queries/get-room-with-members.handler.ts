import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRoomWithMembersQuery } from './get-room-with-members.query';
import { RoomService } from '../services/room.service';

@QueryHandler(GetRoomWithMembersQuery)
export class GetRoomWithMembersHandler
  implements IQueryHandler<GetRoomWithMembersQuery>
{
  constructor(private readonly roomService: RoomService) {}

  async execute(query: GetRoomWithMembersQuery) {
    return this.roomService.getRoomWithMembers(query.roomId);
  }
}
