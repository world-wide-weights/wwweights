import { Item } from '../../models/item.model';
import { Tag } from '../../models/tag.model';

export class ItemInsertedToItemsByTagEvent {
  constructor(public readonly tag: Tag, public readonly item: Item) {}
}
