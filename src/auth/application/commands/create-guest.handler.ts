import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateGuestCommand } from './create-guest.command';
import { AuthService } from '../services/auth.service';

@CommandHandler(CreateGuestCommand)
export class CreateGuestHandler implements ICommandHandler<CreateGuestCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(
    command: CreateGuestCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { user } = command;

    return await this.authService.createGuest(user);
  }
}
