import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { UserFeaturePermissionService } from 'src/users/application/services/user-feature-permission.service';
import { PermissionType } from 'src/users/domain/shared/enumerations';

@Controller('permissions')
export class UserFeaturePermissionController {
  constructor(
    private readonly permissionService: UserFeaturePermissionService,
  ) {}

  @Get(':ownerId/:userId/:feature')
  async checkPermission(
    @Param('ownerId') ownerId: string,
    @Param('userId') userId: string,
    @Param('feature') feature: string,
  ) {
    return await this.permissionService.canUserAccessFeature(
      ownerId,
      userId,
      feature as PermissionType,
    );
  }

  @Get('user/:userId')
  async getPermissionsForUser(@Param('userId') userId: string) {
    return await this.permissionService.getAllPermissionsForUser(userId);
  }

  @Get('owner/:ownerId/:feature')
  async getUsersAllowedByUser(
    @Param('ownerId') ownerId: string,
    @Param('feature') feature: string,
  ) {
    return await this.permissionService.getAllUsersAllowedByUser(
      ownerId,
      feature as PermissionType,
    );
  }

  @Post()
  async grantPermission(
    @Body() body: { ownerId: string; userId: string; feature: string },
  ) {
    return await this.permissionService.grantUserFeaturePermission(
      body.ownerId,
      body.userId,
      body.feature as PermissionType,
    );
  }

  @Delete()
  async revokePermission(
    @Body() body: { ownerId: string; userId: string; feature: string },
  ) {
    return await this.permissionService.revokeUserFeaturePermission(
      body.ownerId,
      body.userId,
      body.feature as PermissionType,
    );
  }
}
