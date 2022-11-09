import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Expose()
  @Column()
  name: string;

  @IsString()
  @Expose()
  @Column()
  weight: string; // exact - range - ca.

  @IsString({ each: true })
  @Expose()
  @Column('text', { array: true })
  tags: string[];

  @IsString()
  @Expose()
  @Column()
  image: string; // Link to static store or base-64 Encoded

  @IsOptional()
  @IsString()
  @Column()
  @Expose({ groups: ['admin'] })
  user?: string;

  @IsBoolean()
  @Expose()
  @Column({ default: true })
  @Expose({ groups: ['admin'] })
  isActive: boolean;
}
