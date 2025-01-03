import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../users/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoginHandler } from './queries/login.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { RegisterHandler } from './commands/register.handler';
import { CreateGuestHandler } from './commands/create-guest.handler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '../redis/redis.module';
import { RefreshTokenHandler } from './queries/refresh-token.handler';
import { LogoutHandler } from './commands/logout.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
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
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    LoginHandler,
    RegisterHandler,
    CreateGuestHandler,
    RefreshTokenHandler,
    LogoutHandler,
  ],
  exports: [AuthService],
})
export class AuthModule {}
