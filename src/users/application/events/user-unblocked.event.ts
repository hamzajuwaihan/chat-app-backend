import { IEvent } from '@nestjs/cqrs';

export class UserUnBlockedEvent implements IEvent {
  constructor(
    public readonly blockerId: string,
    public readonly blockedId: string,
  ) {}
}
