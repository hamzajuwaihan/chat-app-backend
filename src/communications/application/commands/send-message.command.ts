import { ICommand } from '@nestjs/cqrs';

export class SendMessageCommand implements ICommand {
  constructor(
    public readonly senderId: string,
    public readonly receiverId: string,
    public readonly text: string,
  ) {}
}
