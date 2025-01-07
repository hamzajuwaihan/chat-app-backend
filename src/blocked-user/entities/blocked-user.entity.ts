import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/user/domain/entities/user.entity';

@Entity('blocked_users')
export class BlockedUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.blockedUsers, { onDelete: 'CASCADE' })
  blocker: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  blocked: User;

  @CreateDateColumn()
  createdAt: Date;
}
