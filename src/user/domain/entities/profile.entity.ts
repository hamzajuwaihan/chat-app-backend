import { Country } from 'src/lookups/domain/entities/country.entity';
import { User } from 'src/user/domain/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';

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

  @Column({ type: 'json', nullable: true })
  privacySettings: {
    allowPrivateMessages: boolean;
    allowConversationRequests: boolean;
    mediaReception: 'all' | 'friends-only' | 'none';
    invisibleMode: boolean;
  };

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
