import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { GetCountriesHandler } from './queries/get-countries.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { GetCountryByIdHandler } from './queries/get-country-by-id.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Country]), CqrsModule],
  controllers: [CountryController],
  providers: [CountryService, GetCountriesHandler, GetCountryByIdHandler],
  exports: [CountryService],
})
export class CountryModule {}
