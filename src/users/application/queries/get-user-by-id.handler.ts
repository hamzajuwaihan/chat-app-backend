import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '../../domain/entities/user.entity';
import { GetUserByIdQuery } from './get-user-by-id.query';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from '../services/user.service';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly usersService: UsersService) {}

  async execute(query: GetUserByIdQuery): Promise<User> {
    const user = await this.usersService.findById(query.id);
    if (!user) {
      throw new NotFoundException(`User with ID ${query.id} not found`);
    }
    delete user.password_hash;
    return user;
  }
}
