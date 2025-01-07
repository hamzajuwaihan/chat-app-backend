import { IQuery } from '@nestjs/cqrs';
import { CountriesFilter } from '../../presentation/dto/countries-filter.dto';

export class GetCountriesQuery implements IQuery {
  constructor(public readonly filters: CountriesFilter) {}
}
