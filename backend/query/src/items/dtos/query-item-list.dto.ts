import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { QueryTagsAndPage } from '../../shared/interfaces/queryTagsAndPage';
import { ItemSortEnum } from '../enums/item-sort-enum';

export class QueryItemListDto extends QueryTagsAndPage {
  @IsOptional()
  @IsEnum(ItemSortEnum)
  @ApiPropertyOptional({
    enum: ItemSortEnum,
    default: ItemSortEnum.RELEVANCE,
    description: 'Sort by relevance | heaviest | lieghtest',
    example: ItemSortEnum.RELEVANCE,
  })
  sort = ItemSortEnum.RELEVANCE; // Maybe: also newest | oldest

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'The item slug to search for',
    example: 'item-name',
  })
  slug: string;

  @IsOptional()
  @Type(() => String)
  @ApiPropertyOptional({
    type: String,
    description: 'Searching for items with or without images',
    example: '1',
  })
  @Transform(({ value }) => (value === '1' ? true : false))
  hasimage?: boolean;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'Searching for items by a specific user',
    example: 1,
  })
  userid?: number;
}
