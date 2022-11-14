import { Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Expose()
  @Column({ unique: true })
  name: string;

  @Expose()
  @Column()
  slug: string;

  @IsString()
  @Expose()
  @Column()
  value: string; // exact - range - ca.

  @IsOptional()
  @IsBoolean()
  @Expose()
  @Column({ default: false })
  is_ca: boolean;

  @IsString()
  @Expose()
  @Column({ nullable: true })
  additional_range_value: string;

  // TODO: Temporary solution, needs to be @ManyToMany
  @IsString({ each: true })
  @Expose()
  @Column('text', { array: true, nullable: true })
  //@ManyToMany(() => Tag, (tag) => tag.items) No Tags yet
  tags: string[];

  @IsString()
  @Expose()
  @Column({ nullable: true })
  image: string; // Link to static store or base-64 Encoded?

  // TODO: Temporary solution
  @IsString()
  @Expose()
  @Column({
    nullable: true,
    default: 'no source available',
  })
  source: string;

  // TODO: Temporary solution needs to be @ManyToOne
  @IsString()
  @Expose({ groups: ['admin'] })
  @Column()
  user: string;

  // TODO: Temporary solution if implemented needs to be @ManyToMany
  @IsOptional()
  @IsString()
  @Expose({ groups: ['admin'] })
  @Column('text', { array: true, nullable: true })
  related: string[];

  // TODO: Is this even necessary if we OVERWRITE the whole object on submissions, maybe for suggestions where a user says, no this is a stupid entry pls delete xD
  @IsBoolean()
  @Column({ default: true })
  @Expose({ groups: ['admin'] })
  isActive: boolean;

  applySlug() {
    this.slug = this.name.toLowerCase().trim().replace(/ /g, '-');
  }

  constructor(partial: Partial<Item>) {
    Object.assign(this, partial);
  }
}
