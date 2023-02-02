import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Page } from '../../shared/page';
import { ItemSortEnum } from './item-sort-enum';

export class QueryItemListDto extends Page {
  @IsOptional()
  @IsEnum(ItemSortEnum)
  @ApiPropertyOptional({
    enum: ItemSortEnum,
    default: ItemSortEnum.RELEVANCE,
  })
  sort = ItemSortEnum.RELEVANCE; // Maybe: also newest | oldest

  @IsString()
  @IsOptional()
  @Length(0, 100)
  @ApiPropertyOptional({ minLength: 0, maxLength: 100 })
  query: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  @Type(() => String)
  @Transform(({ value }) => [value].flat())
  tags: string[];

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  slug: string;
}
