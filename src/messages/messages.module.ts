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
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/user.service';
import { GetRecentMessagesHandler } from './queries/get-recent-messages.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, User]),
    CqrsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    SendMessageHandler,
    GetMessagesHandler,
    GetRecentMessagesHandler,
    MessagesGateway,
    UserService,
  ],
})
export class MessagesModule {}
