import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MessagesGateway } from 'src/communications/presentation/gateways/messages.gateway';
import { UserUnBlockedEvent } from 'src/users/application/events/user-unblocked.event';

@EventsHandler(UserUnBlockedEvent)
export class UserUnBlockedHandler implements IEventHandler<UserUnBlockedEvent> {
  constructor(private readonly messagesGateway: MessagesGateway) {}

  handle(event: UserUnBlockedEvent): void {
    const { blockerId, blockedId } = event;

    this.messagesGateway.server
      .to(blockerId)
      .emit('userUnblocked', { blockerId, blockedId });
  }
}
