import { Item } from '../../models/item.model';

export class ItemFoundEvent {
  constructor(public readonly item: Item) {}
}
