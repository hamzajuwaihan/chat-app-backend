import { Injectable } from '@nestjs/common';
import { Message } from '../../domain/entities/message.entity';
import { LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
  ) {}

  async create(message: Message): Promise<Message> {
    return this.messagesRepository.save(message);
  }

  async findRecentMessages(
    senderId: string,
    receiverId: string,
    limit: number = 10,
  ): Promise<Message[]> {
    return this.messagesRepository.find({
      where: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findAllBetweenUsers(
    senderId: string,
    receiverId: string,
    before?: string,
    limit: number = 20,
  ): Promise<Message[]> {
    return this.messagesRepository.find({
      where: [
        {
          senderId,
          receiverId,
          createdAt: before ? LessThan(new Date(before)) : undefined,
        },
        {
          senderId: receiverId,
          receiverId: senderId,
          createdAt: before ? LessThan(new Date(before)) : undefined,
        },
      ],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
