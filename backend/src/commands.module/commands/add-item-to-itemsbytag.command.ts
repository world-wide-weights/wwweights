import { Item } from '../../models/item.model';
import { InsertItemTag } from '../interfaces/insert-item.dto';

export class AddItemToItemsByTagCommand {
  constructor(public readonly tag: InsertItemTag, public readonly item: Item) {}
}
