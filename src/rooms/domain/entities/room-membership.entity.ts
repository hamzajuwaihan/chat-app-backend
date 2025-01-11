import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomRole } from '../shared/enumerations';
import { Room } from './room.entity';
import { User } from '../../../users/domain/entities/user.entity';

@Entity('room_memberships')
export class RoomMembership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Room, (room) => room.memberships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne(() => User, (user) => user.memberships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: RoomRole, default: RoomRole.MEMBER })
  role: RoomRole;

  @Column({ type: 'timestamp', nullable: true })
  banned_until?: Date;

  @Column({ type: 'timestamp', nullable: true })
  muted_until?: Date;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @CreateDateColumn()
  joined_at: Date;
}
