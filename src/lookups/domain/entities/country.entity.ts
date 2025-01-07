import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  emoji: string;

  @Column({ nullable: true })
  unicode: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  dial_code: string;
}
