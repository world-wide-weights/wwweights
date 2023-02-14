import { AggregateRoot } from '@nestjs/cqrs';
import { prop } from '@typegoose/typegoose';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { SUGGESTION_STATUS } from '../shared/enums/suggestion-status.enum';

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

class SuggestionWeight {
  @prop()
  value?: number;

  @prop()
  isCa?: boolean;

  @prop()
  additionalValue?: number;
}

// We cannot use picktype here as item extends aggregateroot
export class SuggestionItem {
  @prop()
  name?: string;

  @prop({ type: () => SuggestionWeight, _id: false })
  weight?: SuggestionWeight;

  @prop()
  image?: string; // Link to static store or base-64 Encoded?

  @prop()
  source?: string;

  @prop({ type: () => SuggestionTag, _id: false })
  tags?: SuggestionTag;
}

export class EditSuggestion extends AggregateRoot {
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
    super();
    Object.assign(this, partial);
  }
}
