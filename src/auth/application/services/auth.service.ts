import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { User } from 'src/users/domain/entities/user.entity';
import { UsersService } from 'src/users/application/services/user.service';
import { CacheService } from 'src/app/infrastructure/cache/cache.service';
import { TokensObject } from 'src/users/domain/value-objects/tokens-object';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 300;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Register a new user
   */
  async register(
    email: string,
    password_hash: string,
    nickname: string,
  ): Promise<TokensObject> {
    const hashedPassword = await argon2.hash(password_hash);

    const savedUser = await this.usersService.createUser({
      email,
      password_hash: hashedPassword,
      nickname,
      is_guest: false,
    });

    return await this.generateTokens(savedUser);
  }

  /**
   * Authenticate user (login)
   */
  async login(email: string, password: string): Promise<TokensObject> {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.password_hash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await argon2.verify(user.password_hash, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.generateTokens(user);
  }

  /**
   * Create a guest session
   */
  async createGuest(user: User): Promise<TokensObject> {
    const guest = await this.usersService.createGuest(user);

    return this.generateTokens(guest);
  }

  /**
   * Validate user by JWT
   */
  async validateUser(userId: string): Promise<User> {
    return await this.usersService.findById(userId);
  }

  async logout(userId: string): Promise<void> {
    const refreshToken = await this.cacheService.get(`refresh_token:${userId}`);
    const accessToken = await this.cacheService.get(`access_token:${userId}`);

    if (refreshToken) {
      const decodedRefreshToken = this.jwtService.decode(refreshToken);
      await this.cacheService.set(
        `blacklisted_refresh_token:${userId}`,
        refreshToken,
        Math.floor(decodedRefreshToken['exp'] - Date.now() / 1000),
      );
      await this.cacheService.del(`refresh_token:${userId}`);
    }

    if (accessToken) {
      const decodedAccessToken = this.jwtService.decode(accessToken);
      await this.cacheService.set(
        `blacklisted_access_token:${userId}`,
        accessToken,
        Math.floor(decodedAccessToken['exp'] - Date.now() / 1000),
      );
      await this.cacheService.del(`access_token:${userId}`);
    }
  }

  async refreshTokens(refreshToken: string): Promise<TokensObject> {
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const storedToken = await this.cacheService.get(
      `refresh_token:${payload.sub}`,
    );
    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.validateUser(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const newPayload = await this.generateTokens(user);

    await this.cacheService.set(
      `access_token:${user.id}`,
      newPayload.accessToken,
      900,
    );

    return newPayload;
  }

  async authenticateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.password_hash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const lockKey = `failed_attempts:${user.id}`;

    const attempts = await this.cacheService.get(lockKey);
    const attemptsCount = attempts ? parseInt(attempts) : 0;

    if (attemptsCount >= MAX_ATTEMPTS) {
      throw new UnauthorizedException('Account locked. Try again later.');
    }

    const isPasswordValid = await argon2.verify(user.password_hash, password);

    if (!isPasswordValid) {
      await this.cacheService.set(
        lockKey,
        ((parseInt(attempts) || 0) + 1).toString(),
        LOCK_TIME,
      );
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.cacheService.del(lockKey);
    delete user['password_hash'];
    return user;
  }

  async generateTokens(user: User): Promise<TokensObject> {
    const payload = this.createJwtPayload(user);

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    await this.cacheService.set(
      `refresh_token:${user.id}`,
      refreshToken,
      parseInt(ACCESS_TOKEN_EXPIRY),
    );
    await this.cacheService.set(
      `access_token:${user.id}`,
      accessToken,
      parseInt(ACCESS_TOKEN_EXPIRY),
    );

    return new TokensObject(accessToken, refreshToken);
  }

  /**
   * Create JWT Payload
   */
  private createJwtPayload(user: User) {
    return {
      sub: user.id,
      email: user.email,
      isGuest: user.is_guest,
      nickname: user.nickname,
      createdAt: user.createdAt,
    };
  }
}
