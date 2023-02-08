import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { QueryTagsAndPage } from '../../shared/interfaces/queryTagsAndPage';
import { ItemSortEnum } from './item-sort-enum';

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
}
