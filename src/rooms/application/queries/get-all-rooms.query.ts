import { IQuery } from '@nestjs/cqrs';

export class GetAllRoomsQuery implements IQuery {
  constructor() {}
}
