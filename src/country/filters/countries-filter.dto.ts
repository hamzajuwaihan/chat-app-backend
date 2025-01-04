import { ApiPropertyOptional } from '@nestjs/swagger';
import { Country } from '../entities/country.entity';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CountriesFilter {
  @ApiPropertyOptional({
    enum: ['name', 'code', 'emoji', 'unicode', 'dial_code'],
  })
  @IsOptional()
  @IsString()
  sortBy?: keyof Country;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'ASC' })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
