import { Item } from '../../models/item.model';

/**
 * @description Event for inserting an item
 */
export class ItemInsertedEvent {
  constructor(public readonly item: Item) {}
}
