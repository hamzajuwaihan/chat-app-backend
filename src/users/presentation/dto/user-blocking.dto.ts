import { IsUUID } from 'class-validator';

export class UserBlockingDto {
  @IsUUID()
  id: string;

  @IsUUID()
  blockedId: string;
}
