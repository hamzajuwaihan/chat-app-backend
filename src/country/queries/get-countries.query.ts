import { IQuery } from '@nestjs/cqrs';
import { CountriesFilter } from '../filters/countries-filter.dto';

export class GetCountriesQuery implements IQuery {
  constructor(public readonly filters: CountriesFilter) {}
}
