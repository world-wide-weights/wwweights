import { AggregateRoot } from '@nestjs/cqrs';
import { OmitType, PartialType } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { SUGGESTION_STATUS } from '../shared/enums/suggestion-status.enum';
import { Item } from './item.model';

export class SuggestionTag {
  @prop({type: [String]})
  @IsArray()
  @IsOptional()
  @IsString({each: true})
  push?: string[] 

  @prop({type: [String]})
  @IsArray()
  @IsOptional()
  @IsString({each: true})
  pull?: string[]
}

export class SuggestionItem extends PartialType(OmitType(Item, ['slug', 'tags', 'createdAt'])){
  @prop({type: () => SuggestionTag})
  @IsOptional()
  @Type(() => SuggestionTag)
 tags?: SuggestionTag
}

export class EditSuggestion extends AggregateRoot {
  @Expose()
  @prop({ required: true })
  @IsInt()
  user: number;

  @Expose()
  @prop({ required: true })
  @IsString()
  itemSlug: string;

  @Expose()
  @prop({ required: true, type: () => SuggestionItem })
  @Type(() => SuggestionItem)
  updatedItemValues: SuggestionItem 

  @Expose()
  @prop({required: true, default: 0})
  approvalCount: number

  @Expose()
  @prop({required: true, default: SUGGESTION_STATUS.PENDING })
  status: SUGGESTION_STATUS

  @Expose()
  @prop({required: true})
  uuid: string

  constructor(partial: Partial<EditSuggestion>) {
    super()
    Object.assign(this, partial);
  }
}
