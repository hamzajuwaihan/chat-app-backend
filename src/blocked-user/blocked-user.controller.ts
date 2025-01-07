import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BlockUserCommand } from './commands/block-user.command';
import { UnblockUserCommand } from './commands/unblock-user.command';
import { AuthGuard } from '@nestjs/passport';
import { OwnershipGuard } from 'src/auth/presentation/guards/ownership.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BlockUserParamDto } from './dto/blocked-user.dto';
import { UuidParamDto } from 'src/shared/dtos/uuid-param.dto';
import { GetBlockedUsersQuery } from './queries/get-blocked-users.query';

@Controller('blocked-users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class BlockedUserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post(':userId/:blockedId')
  @UseGuards(OwnershipGuard)
  async blockUser(@Req() req, @Param() params: BlockUserParamDto) {
    await this.commandBus.execute(
      new BlockUserCommand(params.userId, params.blockedId),
    );
    return { message: 'User blocked successfully' };
  }

  @Delete(':userId/:blockedId')
  @UseGuards(OwnershipGuard)
  async unblockUser(@Req() req, @Param() params: BlockUserParamDto) {
    await this.commandBus.execute(
      new UnblockUserCommand(params.userId, params.blockedId),
    );
    return { message: 'User unblocked successfully' };
  }
  //FIXME: Find a way to remove password from response
  @Get(':id')
  @UseGuards(OwnershipGuard)
  async getBlockedUsers(@Param() params: UuidParamDto) {
    return await this.queryBus.execute(new GetBlockedUsersQuery(params.id));
  }
}
