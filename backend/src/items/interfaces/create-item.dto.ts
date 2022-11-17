import { PickType } from '@nestjs/swagger';
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
  'user',
  //'slug', // TODO: Remove this if slug generates without this
]) {}
