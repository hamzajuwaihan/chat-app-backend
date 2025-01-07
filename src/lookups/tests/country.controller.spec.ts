import { Test, TestingModule } from '@nestjs/testing';
import { CountryController } from '../presentation/controllers/country.controller';
import { QueryBus } from '@nestjs/cqrs';

describe('CountryController', () => {
  let controller: CountryController;
  let mockQueryBus: Partial<QueryBus>;

  beforeEach(async () => {
    mockQueryBus = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountryController],
      providers: [
        {
          provide: QueryBus,
          useValue: mockQueryBus,
        },
      ],
    }).compile();

    controller = module.get<CountryController>(CountryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
