import { Injectable } from '@nestjs/common';
import { PrivateMessage } from '../../domain/entities/private-message.entity';
import { LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PrivateMessagesService {
  constructor(
    @InjectRepository(PrivateMessage)
    private readonly messagesRepository: Repository<PrivateMessage>,
  ) {}

  async create(message: PrivateMessage): Promise<PrivateMessage> {
    return this.messagesRepository.save(message);
  }

  async findRecentMessages(
    senderId: string,
    receiverId: string,
    limit: number = 10,
  ): Promise<PrivateMessage[]> {
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
  ): Promise<PrivateMessage[]> {
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
