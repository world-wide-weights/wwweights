import { AggregateRoot } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import slugify from 'slugify';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Item extends AggregateRoot {
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
  @Transform((params) => {
    return slugify(params.obj.name, {
      strict: true,
      lower: true,
      trim: true,
    });
  })
  @Column({ unique: true })
  slug: string;

  @IsNumber()
  @Expose()
  @ApiProperty()
  @Transform((params) => parseFloat(params.obj.value))
  @Column('decimal', { precision: 99, scale: 3 })
  // This is always in grams and scientific notation example: 1.234e+5
  value: number;

  @IsOptional()
  @IsBoolean()
  @Expose()
  @Column({ default: false })
  isCa: boolean;

  @IsNumber()
  @IsOptional()
  @Expose()
  @Transform((params) => parseFloat(params.obj.value))
  @Column('decimal', { precision: 99, scale: 3, nullable: true })
  additional_range_value: number;

  // TODO: Temporary solution, needs to be @ManyToMany
  @IsString({ each: true })
  @IsOptional()
  @Expose()
  @Column('text', { array: true, nullable: true })
  //@ManyToMany(() => Tag, (tag) => tag.items) No Tags yet
  tags: string[];

  @IsString()
  @IsOptional()
  @Expose()
  @Column({ nullable: true })
  image: string; // Link to static store or base-64 Encoded?

  // TODO: Temporary solution
  @IsString()
  @IsOptional()
  @Expose()
  @Column({
    nullable: true,
    default: 'no source available',
  })
  source: string;

  // TODO: Temporary solution needs to be @ManyToOne
  @IsString()
  @ApiProperty()
  @Expose()
  @Column()
  user: string;

  // TODO: Temporary solution if implemented needs to be @ManyToMany
  // @IsOptional()
  // @IsString()
  // @Expose({ groups: ['admin'] })
  // @ApiProperty()
  // @Column('text', { array: true, nullable: true })
  // related: string[];

  // TODO: Is this even necessary if we OVERWRITE the whole object on submissions, maybe for suggestions where a user says, no this is a stupid entry pls delete xD
  // @Column({ default: true })
  // @Expose({ groups: ['admin'] })
  // isActive: boolean;

  // @VersionColumn()
  // @Expose({ groups: ['admin'] })
  // version: number;

  constructor(partial: Partial<Item>) {
    super();
    Object.assign(this, partial);
  }
}
