import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from 'src/lookups/domain/entities/country.entity';
import { SeedCommand } from './infrastructure/seed/seed.command';
import { SeedService } from './infrastructure/seed/seed.service';
import { CountryController } from './presentation/controllers/country.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CountryService } from './application/services/country.service';
import { GetCountriesHandler } from './application/queries/get-countries.handler';
import { GetCountryByIdHandler } from './application/queries/get-country-by-id.handler';
import { DatabaseModule } from 'src/app/infrastructure/database/database.module';
import { Room } from 'src/rooms/domain/entities/room.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Country, Room]),
    CqrsModule,
  ],
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
