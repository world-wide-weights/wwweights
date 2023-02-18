import { SuggestionItem } from '../../models/edit-suggestion.model';

/**
 * @description Command for initiating item change 
 */
export class EditItemCommand {
  constructor(
    public readonly itemSlug: string,
    public readonly suggestionUuid: string,
    public readonly editValues: SuggestionItem,
  ) {}
}
