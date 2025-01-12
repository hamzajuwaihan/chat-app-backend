import { IQuery } from '@nestjs/cqrs';

export class GetRoomWithMembersQuery implements IQuery {
  constructor(public readonly roomId: string) {}
}
