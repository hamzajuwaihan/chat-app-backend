import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UuidParamDto } from '../common/dtos/uuid-param.dto';
import { GetUserByIdQuery } from './queries/get-user-by-id.query';
import { QueryBus } from '@nestjs/cqrs';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'The user data', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param() params: UuidParamDto): Promise<User> {
    return await this.queryBus.execute(new GetUserByIdQuery(params.id));
  }
}
