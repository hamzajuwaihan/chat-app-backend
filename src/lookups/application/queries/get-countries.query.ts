import { IQuery } from '@nestjs/cqrs';
import { CountriesFilter } from '../dto/countries-filter.dto';

export class GetCountriesQuery implements IQuery {
  constructor(public readonly filters: CountriesFilter) {}
}
