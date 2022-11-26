import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column } from 'typeorm';
import { Item } from '../models/item.model';

// Using Pick instead of Partial (makes everything optional)
export class CreateItemDto extends PickType(Item, [
  'name',
  'value',
  'is_ca',
  'additional_range_value',
  'tags',
  'image',
  'source',
  'slug',
]) {
  // Current Behavior: since we want certain user fields only to be seen by group 'admin', the class=transformer would strip the entire thing on server Entry
  // TODO: This can possibly be relocated into the item.model if nestjs supports: ignoreGroup on plainToClass
  @IsString()
  @ApiProperty()
  @Column()
  user: string;
}
