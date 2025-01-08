import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as countryData from './data/country.json';
import { Country } from '../../domain/entities/country.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}
  async run() {
    Logger.log('🌍 Seeding countries...');

    const countryCount = await this.countryRepository.count();
    if (countryCount === 0) {
      Logger.log(`🌍 Seeding ${countryData.length} countries...`);
      await this.countryRepository.save(countryData);
      Logger.log('✅ Countries seeded successfully.');
    } else {
      Logger.log('⚠️ Countries already exist. Skipping seeding.');
    }
  }
}
