import { IEvent } from '@nestjs/cqrs';
import { PermissionType } from 'src/users/domain/shared/enumerations';

export class PrivacySettingsUpdatedEvent implements IEvent {
  constructor(
    public readonly userId: string,
    public readonly permissionsToRemove: PermissionType[],
  ) {}
}
