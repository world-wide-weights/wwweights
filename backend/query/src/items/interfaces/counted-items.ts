import { Item } from '../../models/item.model';

export class CountedItems {
  total: [{ count: number }];
  items: Item[];
}
