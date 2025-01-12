import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { GenderDto } from './enums.dto';

export class GuestDto {
  @ApiProperty({
    example: 'guest_nickname',
    description: 'The nickname of the guest user',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  nickname: string;

  @IsNotEmpty()
  @IsEnum(GenderDto, { message: 'Invalid Gender' })
  gender: GenderDto;
}
