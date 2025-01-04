import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message } from './entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { GetMessagesHandler } from './queries/get-messages.handler';
import { SendMessageHandler } from './commands/send-message.handler';
import { MessagesGateway } from './messages.gateway';
import { JwtModule } from '@nestjs/jwt';
import { GetRecentMessagesHandler } from './queries/get-recent-messages.handler';
import { UsersModule } from 'src/user/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    CqrsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
  ],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    SendMessageHandler,
    GetMessagesHandler,
    GetRecentMessagesHandler,
    MessagesGateway,
  ],
})
export class MessagesModule {}
