import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './logout.command';
import { AuthService } from '../services/auth.service';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: LogoutCommand): Promise<{ message: string }> {
    const { userId } = command;

    await this.authService.logout(userId);

    return { message: 'Successfully logged out' };
  }
}
