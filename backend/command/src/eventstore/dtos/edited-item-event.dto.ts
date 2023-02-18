import { SuggestionItem } from '../../models/edit-suggestion.model';

/**
 * @description DTO for sending an item edit event to eventstore
 */
export class ItemEditedEventDTO {
  itemSlug: string;
  suggestionUuid: string;
  editValues: SuggestionItem;
}
