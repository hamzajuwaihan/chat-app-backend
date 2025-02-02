import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCountryByIdQuery } from './get-country-by-id.query';
import { CountryService } from '../services/country.service';
import { Country } from '../../domain/entities/country.entity';

@QueryHandler(GetCountryByIdQuery)
export class GetCountryByIdHandler
  implements IQueryHandler<GetCountryByIdQuery>
{
  constructor(private readonly countryService: CountryService) {}

  async execute(query: GetCountryByIdQuery): Promise<Country> {
    return await this.countryService.findOne(query.id);
  }
}
