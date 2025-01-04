import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from 'src/country/entities/country.entity';
import { SeedCommand } from './seed/seed.command';
import { SeedService } from './seed/seed.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Country])],
  providers: [SeedService, SeedCommand],
})
export class SeedModule {}
