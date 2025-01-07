import { Test, TestingModule } from '@nestjs/testing';
import { CountryService } from '../application/services/country.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Country } from '../domain/entities/country.entity';

describe('CountryService', () => {
  let service: CountryService;

  beforeEach(async () => {
    const mockCountryRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountryService,
        {
          provide: getRepositoryToken(Country),
          useValue: mockCountryRepository,
        },
      ],
    }).compile();

    service = module.get<CountryService>(CountryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
