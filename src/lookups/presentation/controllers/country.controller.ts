import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CountriesFilter } from '../dto/countries-filter.dto';
import { Country } from '../../domain/entities/country.entity';
import { QueryBus } from '@nestjs/cqrs';
import { GetCountriesQuery } from '../../application/queries/get-countries.query';
import { GetCountryByIdQuery } from '../../application/queries/get-country-by-id.query';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
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

    const validatedSortBy =
      query.sortBy && allowedSortFields.includes(query.sortBy)
        ? query.sortBy
        : undefined;

    const filters: CountriesFilter = {
      sortBy: validatedSortBy as keyof Country,
      sortOrder: query.sortOrder || 'ASC',
    };

    return await this.queryBus.execute(new GetCountriesQuery(filters));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.queryBus.execute(new GetCountryByIdQuery(id));
  }
}
