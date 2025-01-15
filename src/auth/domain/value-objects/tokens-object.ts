export class TokensObject {
  constructor(
    private readonly _accessToken: string,
    private readonly _refreshToken: string,
  ) {}

  public get accessToken(): string {
    return this._accessToken;
  }
  public get refreshToken(): string {
    return this._refreshToken;
  }
}
