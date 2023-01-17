import { Item } from '../../models/item.model';

export class ItemInsertedEvent {
  constructor(public readonly item: Item) {}
}
