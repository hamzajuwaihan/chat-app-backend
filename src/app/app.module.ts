import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './presentation/controllers/app.controller';
import { AppService } from './application/services/app.service';
import { LoggingMiddleware } from './presentation/middleware/logging.middleware';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { MessagesModule } from '../communications/messages.module';
import { CacheModule } from './infrastructure/cache/cache.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CommandRunnerModule } from 'nest-commander';
import { LookupsModule } from '../lookups/lookups.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { HealthController } from './presentation/controllers/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    MessagesModule,
    CacheModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        name: 'login',
        ttl: 60000,
        limit: 5,
      },
    ]),
    LookupsModule,
    CommandRunnerModule,
    TerminusModule,
    HttpModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
