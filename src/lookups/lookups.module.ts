import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from 'src/lookups/domain/entities/country.entity';
import { SeedCommand } from './infrastructure/seed/seed.command';
import { SeedService } from './infrastructure/seed/seed.service';
import { DatabaseModule } from 'src/database/database.module';
import { CountryController } from './presentation/controllers/country.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CountryService } from './application/services/country.service';
import { GetCountriesHandler } from './application/queries/get-countries.handler';
import { GetCountryByIdHandler } from './application/queries/get-country-by-id.handler';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Country]), CqrsModule],
  controllers: [CountryController],
  providers: [
    SeedService,
    SeedCommand,
    CountryService,
    GetCountriesHandler,
    GetCountryByIdHandler,
  ],
  exports: [CountryService],
})
export class LookupsModule {}
