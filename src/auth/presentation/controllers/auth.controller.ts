import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateGuestCommand } from '../../application/commands/create-guest.command';
import { GuestDto } from '../dtos/guest.dto';
import { LoginDto } from '../dtos/login.dto';
import { LoginQuery } from '../../application/queries/login.query';
import { LogoutCommand } from '../../application/commands/logout.command';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokenQuery } from '../../application/queries/refresh-token.query';
import { RegisterCommand } from '../../application/commands/register.command';
import { RegisterDto } from '../dtos/register.dto';

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
    const userId = req.user.id;
    return await this.commandBus.execute(new LogoutCommand(userId));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('protected')
  getProtectedResource() {
    return { message: 'This is a protected resource' };
  }
}
