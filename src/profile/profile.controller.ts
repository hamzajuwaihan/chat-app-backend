import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetProfileByUserIdQuery } from './queries/get-profile-by-userId.query';
import { UuidParamDto } from 'src/common/dtos/uuid-param.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateProfileCommand } from './commands/update-profile.command';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OwnershipGuard } from 'src/auth/guards/ownership.gaurd';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(':id')
  async getProfile(@Param() params: UuidParamDto) {
    return await this.queryBus.execute(new GetProfileByUserIdQuery(params.id));
  }

  @Patch(':id')
  @UseGuards(OwnershipGuard)
  async updateProfile(
    @Param() params: UuidParamDto,
    @Body() dto: UpdateProfileDto,
  ) {
    return await this.commandBus.execute(
      new UpdateProfileCommand(params.id, dto),
    );
  }
}
