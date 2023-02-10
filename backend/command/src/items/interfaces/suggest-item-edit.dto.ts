import { OmitType } from '@nestjs/mapped-types';
import { EditSuggestion } from '../../models/edit-suggestion.model';

export class SuggestItemEditDTO extends OmitType(EditSuggestion, ['approvalCount','user', 'status', 'uuid'] as const){}