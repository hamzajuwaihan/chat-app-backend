import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile } from './entities/profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ProfileController } from './profile.controller';
import { GetProfileByUserIdHandler } from './queries/get-profile-by-userId.handler';
import { UpdateProfileHandler } from './commands/update-profile.handler';
import { CountryModule } from 'src/country/country.module';

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), CqrsModule, CountryModule],
  providers: [ProfileService, GetProfileByUserIdHandler, UpdateProfileHandler],
  exports: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
