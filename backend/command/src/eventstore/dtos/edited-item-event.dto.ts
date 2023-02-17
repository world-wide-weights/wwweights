import { SuggestionItem } from '../../models/edit-suggestion.model';

export class ItemEditedEventDTO {
  itemSlug: string;
  suggestionUuid: string;
  editValues: SuggestionItem;
}
