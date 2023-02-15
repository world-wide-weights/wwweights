import { ItemDeleteSuggestedHandler } from './item-delete-suggested.handler';
import { ItemEditSuggestedHandler } from './item-edit-suggested.handler';
import { ItemInsertedHandler } from './item-inserted.handler';
export const EventHandlers = [
  ItemInsertedHandler,
  ItemEditSuggestedHandler,
  ItemDeleteSuggestedHandler,
];
