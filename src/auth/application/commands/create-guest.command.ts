import { ICommand } from '@nestjs/cqrs';
import { User } from 'src/users/domain/entities/user.entity';

export class CreateGuestCommand implements ICommand {
  constructor(public readonly user: User) {}
}
