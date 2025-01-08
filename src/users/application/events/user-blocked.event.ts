import { IEvent } from '@nestjs/cqrs';

export class UserBlockedEvent implements IEvent {
  constructor(
    public readonly blockerId: string,
    public readonly blockedId: string,
  ) {}
}
