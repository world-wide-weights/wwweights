import { OmitType } from '@nestjs/mapped-types';
import { EditSuggestion } from 'src/models/edit-suggestion.model';

export class SuggestItemEditDTO extends OmitType(EditSuggestion, ['approvalCount','user'] as const){}