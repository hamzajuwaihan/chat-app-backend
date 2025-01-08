import { Module } from '@nestjs/common';
import { MessagesService } from './application/services/messages.service';
import { Message } from './domain/entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { GetMessagesHandler } from './application/queries/get-messages.handler';
import { MessagesGateway } from './presentation/gateways/messages.gateway';
import { JwtModule } from '@nestjs/jwt';
import { GetRecentMessagesHandler } from './application/queries/get-recent-messages.handler';
import { UsersModule } from 'src/users/users.module';
import { RedisModule } from 'src/app/infrastructure/redis/redis.module';
import { UserBlockedEvent } from 'src/users/application/events/user-blocked.event';
import { UserUnBlockedHandler } from './application/events/handlers/user-unblocked.handler';
import { MessagesController } from './presentation/controllers/messages.controller';
import { SendMessageHandler } from './application/commands/send-message.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    CqrsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    RedisModule,
  ],
  controllers: [MessagesController],
  providers: [
    GetMessagesHandler,
    GetRecentMessagesHandler,
    MessagesGateway,
    MessagesService,
    SendMessageHandler,
    UserBlockedEvent,
    UserUnBlockedHandler,
  ],
  exports: [MessagesGateway],
})
export class MessagesModule {}
