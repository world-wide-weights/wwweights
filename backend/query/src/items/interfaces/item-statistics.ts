import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { items } from '../../../test/mocks/items';
import { Item } from '../models/item.model';

export class ItemStatistics {
  @Expose()
  @Transform(({ obj }) => new Item(obj.heaviest))
  // TODO: Update the example when Item changes
  @ApiResponseProperty({ type: Item, example: items[0] })
  heaviest: Item;
  @Expose()
  @Transform(({ obj }) => new Item(obj.lightest))
  @ApiResponseProperty({ type: Item, example: items[0] })
  lightest: Item;
  @Expose()
  @ApiResponseProperty({ type: Number, example: items[0].weight.value })
  averageWeight: number;

  constructor(partial: Partial<ItemStatistics>) {
    Object.assign(this, partial);
  }
}
