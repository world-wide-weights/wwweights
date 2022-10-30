import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  weight: string; // exact - rannge - ca.

  @Column()
  tags: string[];

  @Column()
  image: string; // Link to static store or base-64 Encoded

  @Column({ default: true })
  isActive: boolean;
}
