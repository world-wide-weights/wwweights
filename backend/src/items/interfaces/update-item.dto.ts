import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Item } from '../models/item.model';

export class UpdateItemDto extends PartialType(
  OmitType(Item, ['id'] as const),
) {}
