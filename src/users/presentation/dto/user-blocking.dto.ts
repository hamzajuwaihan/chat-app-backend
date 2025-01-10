import { IsUUID } from 'class-validator';

export class UserBlockingDto {
  @IsUUID()
  blockedId: string;
}
