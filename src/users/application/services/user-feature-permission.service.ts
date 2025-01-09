import { Injectable } from '@nestjs/common';
import { PermissionType } from 'src/users/domain/shared/enumerations';
import { UserFeaturePermissionRepository } from 'src/users/infrastructure/repositories/user-feature-permission.repository';

@Injectable()
export class UserFeaturePermissionService {
  constructor(
    private readonly permissionRepo: UserFeaturePermissionRepository,
  ) {}

  async canUserAccessFeature(
    ownerId: string,
    userId: string,
    feature: PermissionType,
  ): Promise<boolean> {
    return await this.permissionRepo.hasPermission(ownerId, userId, feature);
  }

  async getAllPermissionsForUser(userId: string) {
    return await this.permissionRepo.getPermissionsForUser(userId);
  }

  async getAllUsersAllowedByUser(ownerId: string, feature: PermissionType) {
    return await this.permissionRepo.getUsersAllowedByUser(ownerId, feature);
  }

  async grantUserFeaturePermission(
    ownerId: string,
    userId: string,
    feature: PermissionType,
  ) {
    return await this.permissionRepo.grantPermission(ownerId, userId, feature);
  }

  async revokeUserFeaturePermission(
    ownerId: string,
    userId: string,
    feature: PermissionType,
  ) {
    return await this.permissionRepo.revokePermission(ownerId, userId, feature);
  }
}
