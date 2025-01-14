import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from 'src/users/application/services/user.service';
import { RegisterCommand } from './register.command';
import { CacheService } from 'src/app/infrastructure/cache/cache.service';
import { AuthService } from '../services/auth.service';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(
    command: RegisterCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password, nickname } = command;

    return await this.authService.register(email, password, nickname);
  }
}
