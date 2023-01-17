import { DecrementTagHandler } from './decrement-tag.handler';
import { IncrementTagHandler } from './increment-tag.handler';
import { InsertItemHandler } from './insert-item.handler';
import { InsertTagHandler } from './insert-tag.handler';

// We do this to not overflow the items.module.ts file, there is no need for any other file to import this.
export const CommandHandlers = [
  InsertItemHandler,
  InsertTagHandler,
  IncrementTagHandler,
  DecrementTagHandler,
];
