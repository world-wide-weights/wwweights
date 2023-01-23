import { Item } from '../../models/item.model';

export class CountedData {
  total: [{ count: number }];
  data: Item[];
}
