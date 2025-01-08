import { ICommand } from '@nestjs/cqrs';

export class GetBlockedUsersQuery implements ICommand {
  constructor(public readonly userId: string) {}
}
