import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserFeaturePermission } from 'src/users/domain/entities/user-feature-permission.entity';
import { PermissionType } from 'src/users/domain/shared/enumerations';

@Injectable()
export class UserFeaturePermissionRepository extends Repository<UserFeaturePermission> {
  constructor(private readonly dataSource: DataSource) {
    super(UserFeaturePermission, dataSource.createEntityManager());
  }

  async hasPermission(
    ownerId: string,
    allowedUserId: string,
    permissionType: PermissionType,
  ): Promise<boolean> {
    const permission = await this.findOne({
      where: {
        user: { id: ownerId },
        allowedUser: { id: allowedUserId },
        permissionType,
      },
    });

    return !!permission;
  }

  async getPermissionsForUser(
    userId: string,
  ): Promise<UserFeaturePermission[]> {
    return await this.find({
      where: { allowedUser: { id: userId } },
      relations: ['user', 'allowedUser'],
    });
  }

  async getUsersAllowedByUser(
    ownerId: string,
    permissionType: PermissionType,
  ): Promise<UserFeaturePermission[]> {
    return await this.find({
      where: { user: { id: ownerId }, permissionType },
      relations: ['user', 'allowedUser'],
    });
  }

  async grantPermission(
    ownerId: string,
    allowedUserId: string,
    permissionType: PermissionType,
  ): Promise<UserFeaturePermission> {
    let permission = await this.findOne({
      where: {
        user: { id: ownerId },
        allowedUser: { id: allowedUserId },
        permissionType,
      },
    });

    if (!permission) {
      permission = this.create({
        user: { id: ownerId },
        allowedUser: { id: allowedUserId },
        permissionType,
      });
      await this.save(permission);
    }

    return permission;
  }

  async revokePermission(
    ownerId: string,
    allowedUserId: string,
    permissionType: PermissionType,
  ): Promise<boolean> {
    const permission = await this.findOne({
      where: {
        user: { id: ownerId },
        allowedUser: { id: allowedUserId },
        permissionType,
      },
    });

    if (permission) {
      await this.remove(permission);
      return true;
    }
    return false;
  }
}
