import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreateGuestCommand } from './create-guest.command';

@CommandHandler(CreateGuestCommand)
export class CreateGuestHandler implements ICommandHandler<CreateGuestCommand> {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: CreateGuestCommand): Promise<{ accessToken: string }> {
    const { nickname } = command;

    const guest = await this.userService.createGuest(nickname);

    const payload = { sub: guest.id, isGuest: true };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '24h',
    });

    return { accessToken };
  }
}
