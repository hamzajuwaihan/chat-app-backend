import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MessagesGateway } from 'src/communications/presentation/gateways/messages.gateway';
import { UserBlockedEvent } from 'src/users/application/events/user-blocked.event';

@EventsHandler(UserBlockedEvent)
export class UserBlockedHandler implements IEventHandler<UserBlockedEvent> {
  constructor(private readonly messagesGateway: MessagesGateway) {}

  handle(event: UserBlockedEvent): void {
    const { blockerId, blockedId } = event;

    this.messagesGateway.server
      .to(blockerId)
      .emit('userBlocked', { blockerId, blockedId });
  }
}
