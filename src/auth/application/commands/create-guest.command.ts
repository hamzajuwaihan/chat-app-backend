import { User } from 'src/users/domain/entities/user.entity';

export class CreateGuestCommand {
  constructor(public readonly user: User) {}
}
