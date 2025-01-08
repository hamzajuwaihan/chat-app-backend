import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateMessageDto } from '../dto/create-message.dto';
import { SendMessageCommand } from 'src/communications/application/commands/send-message.command';
import { Message } from 'src/communications/domain/entities/message.entity';
import { GetMessagesQuery } from 'src/communications/application/queries/get-message.query';

@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createMessageDto: CreateMessageDto,
    @Req() req,
  ): Promise<void> {
    const senderId = req.user.sub;
    const { receiverId, text } = createMessageDto;

    await this.commandBus.execute(
      new SendMessageCommand(senderId, receiverId, text),
    );
  }

  @Get(':senderId/:receiverId')
  async findAll(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
    @Query('before') before?: string,
    @Query('limit') limit: number = 20,
  ): Promise<Message[]> {
    return await this.queryBus.execute(
      new GetMessagesQuery(senderId, receiverId, before, limit),
    );
  }
}
