import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RoomService } from 'src/rooms/application/services/room.service';
import { RoomMembership } from 'src/rooms/domain/entities/room-membership.entity';
import { AddUserToRoomCommand } from './add-user-to-room.command';
import { UsersService } from 'src/users/application/services/user.service';

@CommandHandler(AddUserToRoomCommand)
export class AddUserToRoomHandler
  implements ICommandHandler<AddUserToRoomCommand>
{
  constructor(
    private readonly roomService: RoomService,
    private readonly userService: UsersService,
  ) {}

  async execute(command: AddUserToRoomCommand): Promise<RoomMembership> {
    const { roomId, userId } = command;

    const user = await this.userService.findById(userId);

    return this.roomService.addUserToRoom(roomId, user);
  }
}
