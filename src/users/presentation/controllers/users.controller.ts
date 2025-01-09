import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UuidParamDto } from '../../../shared/dtos/uuid-param.dto';
import { GetUserByIdQuery } from '../../application/queries/get-user-by-id.query';
import { GetBlockedUsersQuery } from '../../application/queries/get-blocked-users.query';
import { BlockUserCommand } from '../../application/commands/block-user.command';
import { UnblockUserCommand } from '../../application/commands/unblock-user.command';
import { AuthGuard } from '@nestjs/passport';
import { OwnershipGuard } from 'src/app/presentation/guards/ownership.guard';
import { User } from '../../domain/entities/user.entity';
import { UserBlockingDto } from '../dto/user-blocking.dto';

@Controller('users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  /**
   * Get user by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'The user data', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param() params: UuidParamDto): Promise<User> {
    return await this.queryBus.execute(new GetUserByIdQuery(params.id));
  }

  /**
   * Get list of blocked users
   */
  @Get(':id/blocked')
  @UseGuards(OwnershipGuard)
  @ApiOperation({ summary: 'Get list of blocked users' })
  @ApiResponse({ status: 200, description: 'List of blocked users' })
  async getBlockedUsers(@Param() params: UuidParamDto) {
    return await this.queryBus.execute(new GetBlockedUsersQuery(params.id));
  }

  /**
   * Block a user
   */
  @Post(':id/block/:blockedId')
  @UseGuards(OwnershipGuard)
  @ApiOperation({ summary: 'Block a user' })
  @ApiResponse({ status: 201, description: 'User blocked successfully' })
  async blockUser(@Req() req, @Param() params: UserBlockingDto) {
    await this.commandBus.execute(
      new BlockUserCommand(params.id, params.blockedId),
    );
    return { message: 'User blocked successfully' };
  }

  /**
   * Unblock a user
   */
  @Delete(':id/block/:blockedId')
  @UseGuards(OwnershipGuard)
  @ApiOperation({ summary: 'Unblock a user' })
  @ApiResponse({ status: 200, description: 'User unblocked successfully' })
  async unblockUser(@Req() req, @Param() params: UserBlockingDto) {
    await this.commandBus.execute(
      new UnblockUserCommand(params.id, params.blockedId),
    );
    return { message: 'User unblocked successfully' };
  }
}
