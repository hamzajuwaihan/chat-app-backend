import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { RoomVisibility } from 'src/rooms/domain/shared/enumerations';

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(2)
  max_users?: number;

  @IsOptional()
  theme_settings?: object;

  @IsOptional()
  @IsEnum(RoomVisibility)
  visibility?: RoomVisibility;

  @IsOptional()
  @IsBoolean()
  password_protected?: boolean;
}
