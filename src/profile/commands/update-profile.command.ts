import { ICommand } from '@nestjs/cqrs';
import { UpdateProfileDto } from '../dto/update-profile.dto';

export class UpdateProfileCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly updateProfileDto: UpdateProfileDto,
  ) {}
}
