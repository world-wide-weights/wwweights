import { EditSuggestion } from '../../models/edit-suggestion.model';

/**
 * @description Event for creating an item edit suggestion
 */
export class ItemEditSuggestedEvent {
  constructor(public readonly editSuggestion: EditSuggestion) {}
}
