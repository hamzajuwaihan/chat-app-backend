import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CountryService } from '../country.service';
import { GetCountriesQuery } from './get-countries.query';
import { Country } from '../entities/country.entity';

@QueryHandler(GetCountriesQuery)
export class GetCountriesHandler implements IQueryHandler<GetCountriesQuery> {
  constructor(private readonly countryService: CountryService) {}

  async execute(query: GetCountriesQuery): Promise<Country[]> {
    return await this.countryService.findAll(query.filters);
  }
}
