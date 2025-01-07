import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  profile_picture?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastActive?: Date;

  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;

  @IsOptional()
  @IsUUID()
  countryId?: string;
}
