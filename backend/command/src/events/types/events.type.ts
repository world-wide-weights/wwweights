import { ItemDeleteSuggestedEvent } from '../item-events/item-delete-suggested.event';
import { ItemDeletedEvent } from '../item-events/item-deleted.event';
import { ItemEditSuggestedEvent } from '../item-events/item-edit-suggested.event';
import { ItemEditedEvent } from '../item-events/item-edited.event';

/**
 * @description List of allowed eventTypes
 */
export type UnionEvents =
  | typeof ItemDeleteSuggestedEvent
  | typeof ItemDeletedEvent
  | typeof ItemEditSuggestedEvent
  | typeof ItemEditedEvent
  | typeof ItemEditedEvent;
