import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { GuestDto } from './dtos/guest.dto';
import { AuthGuard } from '@nestjs/passport';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoginQuery } from './queries/login.query';
import { RegisterCommand } from './commands/register.command';
import { CreateGuestCommand } from './commands/create-guest.command';
import { RefreshTokenQuery } from './queries/refresh-token.query';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { LogoutCommand } from './commands/logout.command';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.queryBus.execute(
      new LoginQuery(loginDto.email, loginDto.password),
    );
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.commandBus.execute(
      new RegisterCommand(
        registerDto.email,
        registerDto.password,
        registerDto.nickname,
      ),
    );
  }

  @Post('create-guest')
  async createGuest(@Body() guestDto: GuestDto) {
    return await this.commandBus.execute(
      new CreateGuestCommand(guestDto.nickname),
    );
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.queryBus.execute(
      new RefreshTokenQuery(refreshTokenDto.refreshToken),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req) {
    const userId = req.user.userId;
    return await this.commandBus.execute(new LogoutCommand(userId));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('protected')
  getProtectedResource() {
    return { message: 'This is a protected resource' };
  }
}
