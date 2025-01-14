import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Profile } from 'src/users/domain/entities/profile.entity';
import { Gender } from '../shared/enumerations';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email: string | null;

  @Column({ type: 'text', nullable: true })
  password_hash: string | null;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  nickname: string | null;

  @Column({ type: 'boolean', default: true })
  is_guest: boolean;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  profile: Profile;
  //TODO: Enhancements on unexpected behavior on this feature + refactor REST api endpoints and websocket events
  @ManyToMany(() => User, { cascade: true })
  @JoinTable({
    name: 'blocked_users',
    joinColumn: { name: 'blocker_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'blocked_id', referencedColumnName: 'id' },
  })
  blockedUsers: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  static createUserWithProfile(userDetails: {
    nickname: string;
    email?: string;
    password?: string;
    gender?: Gender | null;
  }): User {
    const user = new User();
    user.nickname = userDetails.nickname;
    user.password_hash = userDetails?.password;
    user.email = userDetails?.email;
    user.profile = new Profile();
    user.profile.gender = userDetails.gender as unknown as Gender;

    return user;
  }
}
