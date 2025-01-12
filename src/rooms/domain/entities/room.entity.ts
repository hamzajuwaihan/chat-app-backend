import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OwnerType, RoomVisibility } from '../shared/enumerations';
import { Country } from 'src/lookups/domain/entities/country.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int', default: 50 })
  max_users: number;

  @Column({ type: 'json', nullable: true })
  theme_settings?: object;

  @Column({
    type: 'enum',
    enum: RoomVisibility,
    default: RoomVisibility.PUBLIC,
  })
  visibility: RoomVisibility;

  @Column({ type: 'boolean', default: false })
  password_protected: boolean;

  @Column({ type: 'enum', enum: OwnerType })
  owner_type: OwnerType;

  @Column({ type: 'uuid', nullable: true })
  owner_id?: string;

  @ManyToOne(() => Country, { nullable: true })
  @JoinColumn({ name: 'country_id' })
  country?: Country;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
