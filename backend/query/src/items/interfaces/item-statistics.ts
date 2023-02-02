import { Expose, Transform } from 'class-transformer';
import { Item } from '../models/item.model';

export class ItemStatistics {
  @Expose()
  @Transform(({ obj }) => new Item(obj.heaviest))
  heaviest: Item;
  @Expose()
  @Transform(({ obj }) => new Item(obj.lightest))
  lightest: Item;
  @Expose()
  averageWeight: number;

  constructor(partial: Partial<ItemStatistics>) {
    Object.assign(this, partial);
  }
}
