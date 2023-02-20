import { ItemDeleteSuggestedHandler } from './item-delete-suggested.handler';
import { ItemDeletedHandler } from './item-deleted.handler';
import { ItemEditSuggestedHandler } from './item-edit-suggested.handler';
import { ItemEditedHandler } from './item-edited.handler';
import { ItemInsertedHandler } from './item-inserted.handler';

/**
 * @description List of all item related event handlers
 */
export const ItemEventHandlers = [
  ItemInsertedHandler,
  ItemEditSuggestedHandler,
  ItemDeleteSuggestedHandler,
  ItemEditedHandler,
  ItemDeletedHandler,
];
