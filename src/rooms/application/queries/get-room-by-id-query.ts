import { IQuery } from '@nestjs/cqrs';

export class GetRoomByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}
