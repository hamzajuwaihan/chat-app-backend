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

  //
  @ManyToOne(() => Room)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
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

  // TODO: [HIGH] ⚠️ Consider refactoring RoomMembership to avoid ORM-level circular dependencies.
  // Possible Solutions:
  // - Use UUIDs instead of FK relations for room_id & user_id.
  // - Move all membership-related queries to a custom repository.
  // - Ensure manual cleanup for orphaned memberships when deleting Rooms or Users.
}
