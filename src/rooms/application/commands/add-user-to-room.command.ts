import { ICommand } from '@nestjs/cqrs';

export class AddUserToRoomCommand implements ICommand {
  constructor(
    public readonly roomId: string,
    public readonly userId: string,
  ) {}
}
