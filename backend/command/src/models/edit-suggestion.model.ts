import { prop } from '@typegoose/typegoose';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { SUGGESTION_STATUS } from '../shared/enums/suggestion-status.enum';

/**
 * @description Entity/Model for tags in edit suggestion in read db
 */
export class SuggestionTag {
  @prop({ type: [String] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  push?: string[];

  @prop({ type: [String] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  pull?: string[];
}

// OmitType/PickType/PartialType does not work here, therefore this is partially duplicate code
// However we avoid accidentally adding fields if item ever changes its structure
// Solving this is tracked in Issue #424
/**
 * @description Entity/Model for weight in edit suggestion in read db
 */
class SuggestionWeight {
  @prop()
  value?: number;

  @prop()
  isCa?: boolean;

  @prop()
  additionalValue?: number;
}

// OmitType/PickType/PartialType does not work here, therefore this is partially duplicate code
// However we avoid accidentally adding fields if item ever changes its structure
// Solving this is tracked in Issue #424
/**
 * @description Entity/Model for item in edit suggestion in read db
 */
export class SuggestionItem {
  @prop()
  name?: string;

  @prop({ type: () => SuggestionWeight, _id: false })
  weight?: SuggestionWeight;

  @prop()
  image?: string;

  @prop()
  source?: string;

  @prop({ type: () => SuggestionTag, _id: false })
  tags?: SuggestionTag;
}

/**
 * @description Entity/Model for edit suggestion in read db
 */
export class EditSuggestion {
  @prop({ required: true })
  userId: number;

  @prop({ required: true })
  itemSlug: string;

  @prop({ required: true, type: () => SuggestionItem, _id: false })
  updatedItemValues: SuggestionItem;

  @prop({ required: true, default: 0 })
  approvalCount: number;

  @prop({ required: true, default: SUGGESTION_STATUS.PENDING })
  status: SUGGESTION_STATUS;

  @prop({ required: true })
  uuid: string;

  constructor(partial: Partial<EditSuggestion>) {
    Object.assign(this, partial);
  }
}
