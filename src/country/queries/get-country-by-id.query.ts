import { IQuery } from '@nestjs/cqrs';

export class GetCountryByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}
