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
  @Column('decimal', { precision: 128, scale: 3 })
  // This is always in grams and scientific notation example: 1.234e10
  value: number;

  @IsOptional()
  @IsBoolean()
  @Expose()
  @Column({ default: false })
  isCa: boolean;

  @IsNumber()
  @IsOptional()
  @Expose()
  @Transform((params) => {
    return parseFloat(params.obj.additional_range_value) || null;
  })
  @Column('decimal', { precision: 128, scale: 3, nullable: true })
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

  constructor(partial: Partial<Item>) {
    super();
    Object.assign(this, partial);
  }
}
