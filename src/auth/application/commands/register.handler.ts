import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from './register.command';
import { AuthService } from '../services/auth.service';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(
    command: RegisterCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password_hash, nickname } = command.user;

    return await this.authService.register(email, password_hash, nickname);
  }
}
