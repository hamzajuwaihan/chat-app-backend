import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LoginQuery } from './login.query';
import { AuthService } from '../services/auth.service';

@QueryHandler(LoginQuery)
export class LoginHandler implements IQueryHandler<LoginQuery> {
  constructor(private readonly authService: AuthService) {}

  async execute(
    query: LoginQuery,
  ): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const { email, password } = query;

    const user = await this.authService.authenticateUser(email, password);

    const tokens = await this.authService.generateTokens(user);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user,
    };
  }
}
