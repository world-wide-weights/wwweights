import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { Item } from '../../models/item.model';

/**
 * @description Item statistics return object, holds the heaviest, lightest item and average weight of a list of items
 */
export class ItemStatistics {
  @Expose()
  @Transform(({ obj }) => new Item(obj.heaviest))
  @ApiResponseProperty({ type: Item })
  heaviest: Item;

  @Expose()
  @Transform(({ obj }) => new Item(obj.lightest))
  @ApiResponseProperty({ type: Item })
  lightest: Item;

  @Expose()
  @ApiResponseProperty({ type: Number, example: 34560000000 })
  averageWeight: number;

  constructor(partial: Partial<ItemStatistics>) {
    Object.assign(this, partial);
  }
}
