import { Item } from '../../models/item.model';

export class ItemCreatedEvent {
  constructor(public readonly item: Item) {}
}
