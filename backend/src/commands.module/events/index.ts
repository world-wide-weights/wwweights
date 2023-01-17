import { ItemInsertedHandler } from './item-inserted.handler';
import { TagDecrementedHandler } from './tag-decremented.handler';
import { TagIncrementedHandler } from './tag-incremented.handler';
import { TagInsertedHandler } from './tag-inserted.handler';
export const EventHandlers = [
  ItemInsertedHandler,
  TagIncrementedHandler,
  TagDecrementedHandler,
  TagInsertedHandler,
];
