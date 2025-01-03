import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendMessageCommand } from './send-message.command';
import { MessagesService } from '../messages.service';
import { plainToInstance } from 'class-transformer';
import { Message } from '../entities/message.entity';

@CommandHandler(SendMessageCommand)
export class SendMessageHandler implements ICommandHandler<SendMessageCommand> {
  constructor(private readonly messagesService: MessagesService) {}

  async execute(command: SendMessageCommand): Promise<void> {
    const message = plainToInstance(Message, {
      senderId: command.senderId,
      receiverId: command.receiverId,
      text: command.text,
    });

    await this.messagesService.create(message);
  }
}
