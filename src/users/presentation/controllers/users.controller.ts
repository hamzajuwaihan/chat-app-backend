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

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  /**
   * Get list of blocked users for the authenticated user
   */
  @Get('/block')
  @ApiOperation({ summary: 'Get list of blocked users' })
  @ApiResponse({ status: 200, description: 'List of blocked users' })
  async getBlockedUsers(@Req() req) {
    const userId = req.user.id;
    console.log(userId);
    console.log('test');
    return await this.queryBus.execute(new GetBlockedUsersQuery(userId));
  }

  /**
   * Block a user
   */
  @Post('/block/:blockedId')
  @ApiOperation({ summary: 'Block a user' })
  @ApiResponse({ status: 201, description: 'User blocked successfully' })
  async blockUser(@Req() req, @Param() params: UserBlockingDto) {
    const userId = req.user.id;
    console.log('Test route hit');

    await this.commandBus.execute(
      new BlockUserCommand(userId, params.blockedId),
    );
    return { message: 'User blocked successfully' };
  }

  /**
   * Unblock a user
   */
  @Delete('/block/:blockedId')
  @UseGuards(OwnershipGuard)
  @ApiOperation({ summary: 'Unblock a user' })
  @ApiResponse({ status: 200, description: 'User unblocked successfully' })
  async unblockUser(@Req() req, @Param() params: UserBlockingDto) {
    const userId = req.user.id;
    await this.commandBus.execute(
      new UnblockUserCommand(userId, params.blockedId),
    );
    return { message: 'User unblocked successfully' };
  }

  /**
   * Get user by ID
   */
  @Get('/:id') // Matches /users/:id
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'The user data', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param() params: UuidParamDto): Promise<User> {
    console.log('testing');
    return await this.queryBus.execute(new GetUserByIdQuery(params.id));
  }
}
