import { AuthController } from './presentation/controllers/auth.controller';
import { AuthService } from './application/services/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateGuestHandler } from './application/commands/create-guest.handler';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './presentation/strategies/jwt.strategy';
import { LoginHandler } from './application/queries/login.handler';
import { LogoutHandler } from './application/commands/logout.handler';
import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { RefreshTokenHandler } from './application/queries/refresh-token.handler';
import { RegisterHandler } from './application/commands/register.handler';
import { UsersModule } from 'src/user/users.module';

@Module({
  imports: [
    CqrsModule,
    RedisModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'secretKey'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    CreateGuestHandler,
    JwtStrategy,
    LoginHandler,
    LogoutHandler,
    RefreshTokenHandler,
    RegisterHandler,
  ],
  exports: [AuthService],
})
export class AuthModule {}
