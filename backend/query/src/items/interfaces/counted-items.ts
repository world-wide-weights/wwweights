import { Item } from '../models/item.model';

export class DataWithCount {
  total: [{ count: number }];
  data: Item[];
}
