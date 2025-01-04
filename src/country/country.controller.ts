import { Controller, Get, Param, Query } from '@nestjs/common';
import { CountriesFilter } from './filters/countries-filter.dto';
import { Country } from './entities/country.entity';
import { QueryBus } from '@nestjs/cqrs';
import { GetCountriesQuery } from './queries/get-countries.query';
import { GetCountryByIdQuery } from './queries/get-country-by-id.query';

@Controller('country')
export class CountryController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async findAll(@Query() query: CountriesFilter) {
    const allowedSortFields: (keyof Country)[] = [
      'name',
      'code',
      'emoji',
      'unicode',
      'dial_code',
    ];

    // Validate `sortBy`
    const validatedSortBy =
      query.sortBy && allowedSortFields.includes(query.sortBy)
        ? query.sortBy
        : undefined;

    // Construct the filters
    const filters: CountriesFilter = {
      sortBy: validatedSortBy as keyof Country,
      sortOrder: query.sortOrder || 'ASC',
    };

    return await this.queryBus.execute(new GetCountriesQuery(filters));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.queryBus.execute(new GetCountryByIdQuery(id)); // Modify to implement a `FindCountryByIdQuery`
  }
}
