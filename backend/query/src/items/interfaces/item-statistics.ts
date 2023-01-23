import { Expose } from 'class-transformer';
import { Item } from '../../models/item.model';

export class ItemStatistics {
  @Expose()
  heaviest: Item;
  @Expose()
  lightest: Item;
  @Expose()
  averageWeight: number;

  constructor(partial: Partial<ItemStatistics>) {
    Object.assign(this, partial);
  }
}
