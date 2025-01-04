import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CountriesFilter } from './filters/countries-filter.dto';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async findAll(filters: CountriesFilter): Promise<Country[]> {
    const queryBuilder = this.countryRepository.createQueryBuilder('country');

    // Apply sorting only if `sortBy` is valid
    if (filters.sortBy) {
      queryBuilder.orderBy(
        `country.${filters.sortBy}`,
        filters.sortOrder || 'ASC',
      );
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Country | null> {
    return this.countryRepository.findOne({ where: { id } });
  }
}
