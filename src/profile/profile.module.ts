import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile } from './entities/profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ProfileController } from './profile.controller';
import { GetProfileByUserIdHandler } from './queries/get-profile-by-userId.handler';
import { UpdateProfileHandler } from './commands/update-profile.handler';
import { LookupsModule } from 'src/lookups/lookups.module';

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), CqrsModule, LookupsModule],
  providers: [ProfileService, GetProfileByUserIdHandler, UpdateProfileHandler],
  exports: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
