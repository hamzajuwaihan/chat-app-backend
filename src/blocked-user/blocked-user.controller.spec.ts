import { Test, TestingModule } from '@nestjs/testing';
import { BlockedUserController } from './blocked-user.controller';
import { BlockedUserService } from './blocked-user.service';

describe('BlockedUserController', () => {
  let controller: BlockedUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockedUserController],
      providers: [BlockedUserService],
    }).compile();

    controller = module.get<BlockedUserController>(BlockedUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
