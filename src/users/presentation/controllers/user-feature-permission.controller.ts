import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PermissionType } from 'src/users/domain/shared/enumerations';
import { UserFeaturePermissionService } from 'src/users/application/services/user-feature-permission.service';
import { OwnershipGuard } from 'src/app/presentation/guards/ownership.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('permissions')
export class UserFeaturePermissionController {
  constructor(
    private readonly permissionService: UserFeaturePermissionService,
  ) {}

  @Get('user/:userId')
  async getPermissionsForUser(@Param('userId') userId: string) {
    return await this.permissionService.getAllPermissionsForUser(userId);
  }

  @Post()
  async grantPermission(
    @Req() req,
    @Body() body: { userId: string; feature: string },
  ) {
    const userId = req.user.id;

    return await this.permissionService.grantUserFeaturePermission(
      userId,
      body.userId,
      body.feature as PermissionType,
    );
  }
  @UseGuards(OwnershipGuard)
  @Delete()
  async revokePermission(
    @Req() req,
    @Body() body: { userId: string; feature: string },
  ) {
    const ownerId = req.user.id;
    return await this.permissionService.revokeUserFeaturePermission(
      ownerId,
      body.userId,
      body.feature as PermissionType,
    );
  }
}
