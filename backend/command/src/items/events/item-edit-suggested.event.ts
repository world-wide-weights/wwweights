import { EditSuggestion } from "src/models/edit-suggestion.model";

export class ItemEditSuggestedEvent {
    constructor(public readonly editSuggestion: EditSuggestion){}
}