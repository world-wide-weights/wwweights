import { Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Expose()
  @Column()
  name: string;

  @Expose()
  @Column()
  slug: string;

  @IsString()
  @Expose()
  @Column()
  weight: string; // exact - range - ca.

  @IsString({ each: true })
  @Expose()
  @Column('text', { array: true, nullable: true })
  //@ManyToMany(() => Tag, (tag) => tag.items) No Tags yet
  tags: string[];

  @IsString()
  @Expose()
  @Column({ nullable: true })
  image: string; // Link to static store or base-64 Encoded?

  @IsString()
  @Column()
  @Expose({ groups: ['admin'] })
  user: string;

  @IsBoolean()
  @Expose()
  @Column({ default: true })
  @Expose({ groups: ['admin'] })
  isActive: boolean;

  createSlug() {
    this.slug = this.name.toLowerCase().trim().replace(/ /g, '-');
  }

  constructor(partial: Partial<Item>) {
    Object.assign(this, partial);
  }
}
