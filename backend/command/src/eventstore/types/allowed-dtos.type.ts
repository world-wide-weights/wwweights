import { DeleteSuggestion } from '../../models/delete-suggestion.model';
import { EditSuggestion } from '../../models/edit-suggestion.model';
import { Item } from '../../models/item.model';
import { ItemDeletedEventDTO } from '../dtos/deleted-item-event.dto';
import { ItemEditedEventDTO } from '../dtos/edited-item-event.dto';

/**
 * @description List of allowed passing DTOs
 */
export type EventstoreAllowedDtos = EditSuggestion &
  Item &
  DeleteSuggestion &
  ItemDeletedEventDTO &
  ItemEditedEventDTO;
