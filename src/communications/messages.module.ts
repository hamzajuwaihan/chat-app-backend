import { Module } from '@nestjs/common';
import { PrivateMessage } from './domain/entities/private-message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { GetMessagesHandler } from './application/queries/get-messages.handler';
import { MessagesGateway } from './presentation/gateways/messages.gateway';
import { JwtModule } from '@nestjs/jwt';
import { GetRecentMessagesHandler } from './application/queries/get-recent-messages.handler';
import { UsersModule } from 'src/users/users.module';
import { CacheModule } from 'src/app/infrastructure/cache/cache.module';
import { UserBlockedEvent } from 'src/users/application/events/user-blocked.event';
import { UserUnBlockedHandler } from './application/events/handlers/user-unblocked.handler';
import { PrivateMessagesController } from './presentation/controllers/private-messages.controller';
import { SendMessageHandler } from './application/commands/send-message.handler';
import { PrivateMessagesService } from './application/services/private-message.service';
import { RoomMessage } from './domain/entities/room-message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PrivateMessage, RoomMessage]),
    CqrsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    CacheModule,
  ],
  controllers: [PrivateMessagesController],
  providers: [
    GetMessagesHandler,
    GetRecentMessagesHandler,
    MessagesGateway,
    PrivateMessagesService,
    SendMessageHandler,
    UserBlockedEvent,
    UserUnBlockedHandler,
  ],
  exports: [MessagesGateway],
})
export class MessagesModule {}
