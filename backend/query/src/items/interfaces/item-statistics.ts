import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { Item } from '../models/item.model';

export class ItemStatistics {
  @Expose()
  @Transform(({ obj }) => new Item(obj.heaviest))
  // TODO: Update the example when Item changes
  @ApiResponseProperty({ type: Item })
  heaviest: Item;
  @Expose()
  @Transform(({ obj }) => new Item(obj.lightest))
  @ApiResponseProperty({ type: Item })
  lightest: Item;
  @Expose()
  @ApiResponseProperty({ type: Number })
  averageWeight: number;

  constructor(partial: Partial<ItemStatistics>) {
    Object.assign(this, partial);
  }
}
