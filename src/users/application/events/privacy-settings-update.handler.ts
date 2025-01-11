import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrivacySettingsUpdatedEvent } from './privacy-settings-update.event';
import { Logger } from '@nestjs/common';
import { UserFeaturePermissionService } from '../services/user-feature-permission.service';

@EventsHandler(PrivacySettingsUpdatedEvent)
export class PrivacySettingsUpdatedHandler
  implements IEventHandler<PrivacySettingsUpdatedEvent>
{
  constructor(
    private readonly permissionService: UserFeaturePermissionService,
  ) {}
  private readonly logger = new Logger(PrivacySettingsUpdatedHandler.name);

  async handle(event: PrivacySettingsUpdatedEvent) {
    if (event.permissionsToRemove.length === 0) return;

    try {
      await this.permissionService.revokeAllPermissionsForUser(
        event.userId,
        event.permissionsToRemove,
      );
    } catch (error) {
      throw error;
    }
  }
}
