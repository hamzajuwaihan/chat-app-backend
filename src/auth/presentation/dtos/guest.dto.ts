import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class GuestDto {
  @ApiProperty({
    example: 'guest_nickname',
    description: 'The nickname of the guest user',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  nickname: string;
}