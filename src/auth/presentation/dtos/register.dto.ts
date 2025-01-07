import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @IsString()
  @Length(8, 50)
  password: string;

  @ApiProperty({
    example: 'nickname123',
    description: 'The nickname of the user',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  nickname: string;
}
