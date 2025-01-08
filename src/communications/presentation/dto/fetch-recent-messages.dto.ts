import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class FetchRecentMessagesDto {
  @IsUUID()
  @IsNotEmpty()
  receiverId: string;

  @IsNumber()
  @IsOptional()
  limit?: number;
}
