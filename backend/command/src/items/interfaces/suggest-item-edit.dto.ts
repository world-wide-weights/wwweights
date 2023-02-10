import { PartialType, OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { InsertItemDto } from './insert-item.dto';

class SuggestItemEditTagsDTO {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  push: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  pull: string[];
}

export class SuggestItemEditDTO extends PartialType(
  OmitType(InsertItemDto, ['tags'] as const),
) {
  @IsOptional()
  @Type(() => SuggestItemEditTagsDTO)
  tags?: SuggestItemEditTagsDTO;
}
