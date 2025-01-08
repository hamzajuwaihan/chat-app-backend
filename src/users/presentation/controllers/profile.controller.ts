import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UuidParamDto } from 'src/shared/dtos/uuid-param.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OwnershipGuard } from 'src/auth/presentation/guards/ownership.guard';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UpdateProfileCommand } from 'src/users/application/commands/update-profile.command';
import { GetProfileByUserIdQuery } from 'src/users/application/queries/get-profile-by-userId.query';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class ProfileController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(':id/profile')
  async getProfile(@Param() params: UuidParamDto) {
    return await this.queryBus.execute(new GetProfileByUserIdQuery(params.id));
  }

  @Patch(':id/profile')
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
