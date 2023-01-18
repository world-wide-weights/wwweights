import { ItemInsertedToItemsByTagHandler } from './item-inserted-to-itemsbytag.handler';
import { ItemInsertedHandler } from './item-inserted.handler';
import { ItemRemovedFromItemsByTagHandler } from './item-removed-from-itemsbytag.handler';
import { TagDecrementedHandler } from './tag-decremented.handler';
import { TagIncrementedHandler } from './tag-incremented.handler';
import { TagInsertedHandler } from './tag-inserted.handler';
export const EventHandlers = [
  ItemInsertedToItemsByTagHandler,
  ItemInsertedHandler,
  ItemRemovedFromItemsByTagHandler,
  TagDecrementedHandler,
  TagIncrementedHandler,
  TagInsertedHandler,
];
