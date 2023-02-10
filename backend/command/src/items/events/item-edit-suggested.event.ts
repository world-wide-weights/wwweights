import { EditSuggestion } from "src/models/suggestion.model";

export class ItemEditSuggestedEvent {
    constructor(public readonly editSuggestion: EditSuggestion){}
}