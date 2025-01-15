import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RefreshTokenQuery } from './refresh-token.query';
import { AuthService } from '../services/auth.service';
import { TokensObject } from 'src/auth/domain/value-objects/tokens-object';

@QueryHandler(RefreshTokenQuery)
export class RefreshTokenHandler implements IQueryHandler<RefreshTokenQuery> {
  constructor(private readonly authService: AuthService) {}

  async execute(query: RefreshTokenQuery): Promise<TokensObject> {
    const { refreshToken } = query;

    return await this.authService.refreshTokens(refreshToken);
  }
}
