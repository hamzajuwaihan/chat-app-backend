import { Controller, Get, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllRoomsQuery } from 'src/rooms/application/queries/get-all-rooms.query';
import { GetRoomByIdQuery } from 'src/rooms/application/queries/get-room-by-id-query';
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

  @Get('/:id')
  async getById(@Param() params: UuidParamDto) {
    return await this.queryBus.execute(new GetRoomByIdQuery(params.id));
  }
}
