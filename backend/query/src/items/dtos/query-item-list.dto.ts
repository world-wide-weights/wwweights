import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { QueryTagsAndPage } from '../../shared/interfaces/queryTagsAndPage';
import { ItemSortEnum } from '../enums/item-sort-enum';

/**
 * @description Query DTO to retrieve a list of items
 */
export class QueryItemListDto extends QueryTagsAndPage {
  @IsOptional()
  @IsEnum(ItemSortEnum)
  @ApiPropertyOptional({
    enum: ItemSortEnum,
    default: ItemSortEnum.RELEVANCE,
    description: `Sort by ${Object.values(ItemSortEnum).join(' | ')}`,
  })
  sort = ItemSortEnum.RELEVANCE;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The item slug to search for',
    example: 'apple',
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
    description: 'Searching for items by a specific user',
    example: 1,
  })
  @Expose({ name: 'userid' })
  userId?: number;
}
