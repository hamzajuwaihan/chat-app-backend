import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/domain/entities/user.entity';
import { Country } from 'src/lookups/domain/entities/country.entity';
import { Gender, PrivacySettingType, UserStatus } from '../shared/enumerations';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  profile_picture: string;

  @Column({ nullable: true, type: 'timestamp' })
  lastActive: Date;

  @Column({ type: 'json', nullable: true })
  settings: object;

  @Column({
    type: 'json',
    nullable: true,
    default: {
      allowPrivateMessages: PrivacySettingType.ALL,
      allowConversationRequests: true,
      mediaReception: PrivacySettingType.ALL,
      invisibleMode: false,
    },
  })
  privacySettings: {
    allowPrivateMessages: PrivacySettingType;
    allowConversationRequests: boolean;
    mediaReception: PrivacySettingType;
    invisibleMode: boolean;
  };

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.AVAILABLE,
    nullable: true,
  })
  status: UserStatus | null;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.OTHER,
    nullable: true,
  })
  gender: Gender;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Country, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'countryId' })
  country: Country | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
