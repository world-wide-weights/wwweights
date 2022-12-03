import { Item } from '../models/item.model';

export class ItemTestEvent {
  constructor(public readonly item: Item) {}
}
