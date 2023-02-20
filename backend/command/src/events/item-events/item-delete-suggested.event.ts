import { DeleteSuggestion } from '../../models/delete-suggestion.model';

/**
 * @description Event for an item delete suggestion
 */
export class ItemDeleteSuggestedEvent {
  constructor(public readonly deleteSuggestion: DeleteSuggestion) {}
}
