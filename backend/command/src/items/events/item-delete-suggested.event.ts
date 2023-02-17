import { DeleteSuggestion } from '../../models/delete-suggestion.model';

export class ItemDeleteSuggestedEvent {
  constructor(public readonly deleteSuggestion: DeleteSuggestion) {}
}
