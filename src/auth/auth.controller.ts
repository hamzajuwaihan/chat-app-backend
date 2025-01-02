import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(email, password);
  }

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('nickname') nickname: string,
  ) {
    return this.authService.register(email, password, nickname);
  }

  @Post('guest')
  async createGuest(@Body('nickname') nickname: string) {
    return this.authService.createGuest(nickname);
  }
}
