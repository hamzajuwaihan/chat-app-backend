import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { PrivacySettingTypeDto, UserStatusDto } from './enums.dto';

export class UpdateProfileDto {
  @IsOptional()
  @IsNumber()
  @Min(18, { message: 'Age must be at least 18' })
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
  @IsObject()
  privacySettings?: {
    allowPrivateMessages?: PrivacySettingTypeDto;
    allowConversationRequests?: boolean;
    mediaReception?: PrivacySettingTypeDto;
    invisibleMode?: boolean;
  };

  @IsOptional()
  @IsEnum(UserStatusDto, { message: 'Invalid status value' })
  status?: UserStatusDto;

  @IsOptional()
  @IsUUID()
  countryId?: string;
}
