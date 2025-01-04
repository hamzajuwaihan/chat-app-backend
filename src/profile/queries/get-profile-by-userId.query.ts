import { IQuery } from '@nestjs/cqrs';

export class GetProfileByUserIdQuery implements IQuery {
  constructor(public readonly userId: string) {}
}
