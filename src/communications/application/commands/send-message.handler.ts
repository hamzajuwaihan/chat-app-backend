import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendMessageCommand } from './send-message.command';
import { plainToInstance } from 'class-transformer';
import { PrivateMessage } from 'src/communications/domain/entities/private-message.entity';
import { PrivateMessagesService } from '../services/private-message.service';

@CommandHandler(SendMessageCommand)
export class SendMessageHandler implements ICommandHandler<SendMessageCommand> {
  constructor(private readonly messagesService: PrivateMessagesService) {}

  async execute(command: SendMessageCommand): Promise<void> {
    const message = plainToInstance(PrivateMessage, {
      senderId: command.senderId,
      receiverId: command.receiverId,
      text: command.text,
    });

    await this.messagesService.create(message);
  }
}
