import { AuthController } from '../presentation/controllers/auth.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoginQuery } from '../application/queries/login.query';
import { LogoutCommand } from '../application/commands/logout.command';
import { RefreshTokenQuery } from '../application/queries/refresh-token.query';
import { RegisterCommand } from '../application/commands/register.command';
import { CreateGuestCommand } from '../application/commands/create-guest.command';

describe('AuthController', () => {
  let controller: AuthController;
  let queryBus: QueryBus;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const mockQueryBus = {
      execute: jest.fn(),
    };
    const mockCommandBus = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: QueryBus, useValue: mockQueryBus },
        { provide: CommandBus, useValue: mockCommandBus },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    queryBus = module.get<QueryBus>(QueryBus);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call queryBus.execute when login is called', async () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };
    const mockResponse = { token: 'fake-jwt-token' };

    (queryBus.execute as jest.Mock).mockResolvedValue(mockResponse);

    const result = await controller.login(loginDto);

    expect(queryBus.execute).toHaveBeenCalledWith(
      new LoginQuery(loginDto.email, loginDto.password),
    );
    expect(result).toEqual(mockResponse);
  });

  it('should call commandBus.execute when register is called', async () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      nickname: 'test',
    };
    const mockResponse = { message: 'Registration successful' };

    (commandBus.execute as jest.Mock).mockResolvedValue(mockResponse);

    const result = await controller.register(registerDto);

    expect(commandBus.execute).toHaveBeenCalledWith(
      new RegisterCommand(
        registerDto.email,
        registerDto.password,
        registerDto.nickname,
      ),
    );
    expect(result).toEqual(mockResponse);
  });

  it('should call commandBus.execute when createGuest is called', async () => {
    const guestDto = { nickname: 'guest' };
    const mockResponse = { message: 'Guest created' };

    (commandBus.execute as jest.Mock).mockResolvedValue(mockResponse);

    const result = await controller.createGuest(guestDto);

    expect(commandBus.execute).toHaveBeenCalledWith(
      new CreateGuestCommand(guestDto.nickname),
    );
    expect(result).toEqual(mockResponse);
  });

  it('should call queryBus.execute when refreshToken is called', async () => {
    const refreshTokenDto = { refreshToken: 'fake-refresh-token' };
    const mockResponse = { token: 'new-jwt-token' };

    (queryBus.execute as jest.Mock).mockResolvedValue(mockResponse);

    const result = await controller.refreshToken(refreshTokenDto);

    expect(queryBus.execute).toHaveBeenCalledWith(
      new RefreshTokenQuery(refreshTokenDto.refreshToken),
    );
    expect(result).toEqual(mockResponse);
  });

  it('should call commandBus.execute when logout is called', async () => {
    const mockUser = { userId: '12345' };
    const mockResponse = { message: 'Logout successful' };

    const req = { user: mockUser };

    (commandBus.execute as jest.Mock).mockResolvedValue(mockResponse);

    const result = await controller.logout(req);

    expect(commandBus.execute).toHaveBeenCalledWith(
      new LogoutCommand(mockUser.userId),
    );
    expect(result).toEqual(mockResponse);
  });
});
