import { DeleteSuggestion } from '../../models/delete-suggestion.model';
import { EditSuggestion } from '../../models/edit-suggestion.model';
import { Item } from '../../models/item.model';
import { ItemDeletedEventDTO } from '../dtos/deleted-item-event.dto';
import { ItemEditedEventDTO } from '../dtos/edited-item-event.dto';

/**
 * @description List of all allowed inputs for eventstore
 */
export type AllowedEventInputs =
  | ItemEditedEventDTO
  | Item
  | EditSuggestion
  | DeleteSuggestion
  | ItemDeletedEventDTO;
