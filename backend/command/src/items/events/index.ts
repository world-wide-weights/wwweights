import { ItemDeleteSuggestedHandler } from './item-delete-suggested.handler';
import { ItemDeletedHandler } from './item-deleted.handler';
import { ItemEditSuggestedHandler } from './item-edit-suggested.handler';
import { ItemEditedHandler } from './item-edited.handler';
import { ItemInsertedHandler } from './item-inserted.handler';
export const EventHandlers = [
  ItemInsertedHandler,
  ItemEditSuggestedHandler,
  ItemDeleteSuggestedHandler,
  ItemEditedHandler,
  ItemDeletedHandler,
];
