import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SeedService } from '../infrastructure/seed/seed.service';
import { Country } from '../domain/entities/country.entity';

describe('SeedService', () => {
  let service: SeedService;
  let mockCountryRepository: any;

  beforeEach(async () => {
    mockCountryRepository = {
      count: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        {
          provide: getRepositoryToken(Country),
          useValue: mockCountryRepository,
        },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should seed countries if none exist', async () => {
    mockCountryRepository.count.mockResolvedValue(0);
    mockCountryRepository.save.mockResolvedValue([]);

    await service.run();

    expect(mockCountryRepository.count).toHaveBeenCalled();
    expect(mockCountryRepository.save).toHaveBeenCalled();
  });

  it('should skip seeding if countries exist', async () => {
    mockCountryRepository.count.mockResolvedValue(5);

    await service.run();

    expect(mockCountryRepository.count).toHaveBeenCalled();
    expect(mockCountryRepository.save).not.toHaveBeenCalled();
  });
});
