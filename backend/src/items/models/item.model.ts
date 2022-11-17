import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Item {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Expose()
  @ApiProperty()
  @Column({ unique: true })
  name: string;

  @Expose()
  @ApiProperty()
  @Transform((params) =>
    params.obj.name.trim().toLowerCase().replace(/\s/g, '-'),
  )
  @Column({ unique: true })
  slug: string;

  @IsString()
  @Expose()
  @ApiProperty()
  @Column()
  value: string; // exact - range - ca.

  @IsOptional()
  @IsBoolean()
  @Expose()
  @ApiProperty()
  @Column({ default: false })
  is_ca: boolean;

  @IsString()
  @Expose()
  @ApiProperty()
  @Column({ nullable: true })
  additional_range_value: string;

  // TODO: Temporary solution, needs to be @ManyToMany
  @IsString({ each: true })
  @IsOptional()
  @Expose()
  @ApiProperty()
  @Column('text', { array: true, nullable: true })
  //@ManyToMany(() => Tag, (tag) => tag.items) No Tags yet
  tags: string[];

  @IsString()
  @IsOptional()
  @Expose()
  @ApiProperty()
  @Column({ nullable: true })
  image: string; // Link to static store or base-64 Encoded?

  // TODO: Temporary solution
  @IsString()
  @IsOptional()
  @Expose()
  @ApiProperty()
  @Column({
    nullable: true,
    default: 'no source available',
  })
  source: string;

  // TODO: Temporary solution needs to be @ManyToOne
  @IsString()
  @Expose({ groups: ['admin'] })
  @ApiProperty()
  @Column()
  user: string;

  // TODO: Temporary solution if implemented needs to be @ManyToMany
  @IsOptional()
  @IsString()
  @Expose({ groups: ['admin'] })
  @ApiProperty()
  @Column('text', { array: true, nullable: true })
  related: string[];

  // TODO: Is this even necessary if we OVERWRITE the whole object on submissions, maybe for suggestions where a user says, no this is a stupid entry pls delete xD
  @Column({ default: true })
  @Expose({ groups: ['admin'] })
  isActive: boolean;

  // TODO: Delete if not needed
  // applySlug() {
  //   this.slug = this.name.toLowerCase().trim().replace(/ /g, '-');
  // }

  constructor(partial: Partial<Item>) {
    Object.assign(this, partial);
  }
}
