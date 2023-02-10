import { AggregateRoot } from '@nestjs/cqrs';
import { OmitType, PartialType } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { Item } from './item.model';

class SuggestionTag {
  @prop()
  @IsArray()
  @IsOptional()
  @IsString({each: true})
  add?: string[]

  @prop()
  @IsArray()
  @IsOptional()
  @IsString({each: true})
  remove?: string[]
}

class SuggestionItem extends PartialType(OmitType(Item, ['slug', 'tags', 'createdAt'])){
  @prop()
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
  @prop({ required: true })
  @Type(() => SuggestionItem)
  updatedItemValues: SuggestionItem 

  @Expose()
  @prop({required: true, default: 0})
  approvalCount: number

  constructor(partial: Partial<EditSuggestion>) {
    super()
    Object.assign(this, partial);
  }
}
