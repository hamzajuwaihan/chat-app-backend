import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddUserToRoomCommand } from 'src/rooms/application/commands/add-user-to-room.command';
import { GetAllRoomsQuery } from 'src/rooms/application/queries/get-all-rooms.query';
import { GetRoomByIdQuery } from 'src/rooms/application/queries/get-room-by-id-query';
import { GetRoomWithMembersQuery } from 'src/rooms/application/queries/get-room-with-members.query';
import { UuidParamDto } from 'src/shared/dtos/uuid-param.dto';

@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async getAll() {
    return await this.queryBus.execute(new GetAllRoomsQuery());
  }

  @Get('/:id/details')
  async getRoomWithMembers(@Param() params: UuidParamDto) {
    return await this.queryBus.execute(new GetRoomWithMembersQuery(params.id));
  }

  @Post('/:id/members')
  async addUserToRoom(
    @Param() params: UuidParamDto,
    @Body('userId') userId: string,
  ) {
    return await this.commandBus.execute(
      new AddUserToRoomCommand(params.id, userId),
    );
  }

  @Get('/:id')
  async getById(@Param() params: UuidParamDto) {
    return await this.queryBus.execute(new GetRoomByIdQuery(params.id));
  }
}
