import { BlockedUser } from 'src/blocked-user/entities/blocked-user.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email: string | null;

  @Column({ type: 'text', nullable: true })
  password_hash: string | null;

  @Column({ type: 'varchar', length: 50, nullable: false })
  nickname: string | null;

  @Column({ type: 'boolean', default: true })
  is_guest: boolean;

  @Column({ type: 'timestamp', nullable: true })
  expires_at: Date | null;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  profile: Profile;

  @OneToMany(() => BlockedUser, (blockedUser) => blockedUser.blocker)
  blockedUsers: BlockedUser[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
