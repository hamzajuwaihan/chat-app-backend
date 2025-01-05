import { IsUUID } from 'class-validator';

export class BlockUserParamDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  blockedId: string;
}
