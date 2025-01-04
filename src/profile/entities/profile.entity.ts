import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  profile_picture: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true, type: 'timestamp' })
  lastActive: Date;

  @Column({ type: 'json', nullable: true })
  settings: object;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
