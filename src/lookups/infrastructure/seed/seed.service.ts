import { Injectable } from '@nestjs/common';
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
    console.log('🌍 Seeding countries...');

    const countryCount = await this.countryRepository.count();
    if (countryCount === 0) {
      console.log(`🌍 Seeding ${countryData.length} countries...`);
      await this.countryRepository.save(countryData);
      console.log('✅ Countries seeded successfully.');
    } else {
      console.log('⚠️ Countries already exist. Skipping seeding.');
    }
  }
}
