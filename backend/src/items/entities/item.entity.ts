import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  weight: string; // exact - rannge - ca.

  @Column('text', { array: true })
  tags: string[];

  @Column()
  image: string; // Link to static store or base-64 Encoded

  @Column()
  user?: string;

  @Column({ default: true })
  isActive: boolean;
}
