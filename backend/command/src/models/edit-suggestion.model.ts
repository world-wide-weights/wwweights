import { AggregateRoot } from '@nestjs/cqrs';
import { prop } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
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

class SuggestionWeight{
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

  @prop({type: () => SuggestionWeight, _id: false })
  weight?: SuggestionWeight;

  @prop()
  image?: string; // Link to static store or base-64 Encoded?

  @prop()
  source?: string;

  @prop({ type: () => SuggestionTag, _id: false })
  @IsOptional()
  @Type(() => SuggestionTag)
  tags?: SuggestionTag;
}

export class EditSuggestion extends AggregateRoot {
  @Expose()
  @prop({ required: true })
  @IsInt()
  userId: number;

  @Expose()
  @prop({ required: true })
  @IsString()
  itemSlug: string;

  @Expose()
  @prop({ required: true, type: () => SuggestionItem, _id: false })
  @Type(() => SuggestionItem)
  updatedItemValues: SuggestionItem;

  @Expose()
  @prop({ required: true, default: 0 })
  approvalCount: number;

  @Expose()
  @prop({ required: true, default: SUGGESTION_STATUS.PENDING })
  status: SUGGESTION_STATUS;

  @Expose()
  @prop({ required: true })
  uuid: string;

  constructor(partial: Partial<EditSuggestion>) {
    super();
    Object.assign(this, partial);
  }
}
