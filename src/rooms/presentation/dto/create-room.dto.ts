import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  OwnerType,
  RoomVisibility,
} from 'src/rooms/domain/shared/enumerations';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsInt()
  @Min(2)
  max_users: number;

  @IsOptional()
  theme_settings?: object;

  @IsEnum(RoomVisibility)
  visibility: RoomVisibility;

  @IsBoolean()
  password_protected: boolean;

  @IsEnum(OwnerType)
  owner_type: OwnerType;

  @IsOptional()
  @IsUUID()
  country_id?: string;
}
