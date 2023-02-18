import { SuggestionItem } from '../../models/edit-suggestion.model';

export class EditItemCommand {
  constructor(
    public readonly itemSlug: string,
    public readonly suggestionUuid: string,
    public readonly editValues: SuggestionItem,
  ) {}
}
