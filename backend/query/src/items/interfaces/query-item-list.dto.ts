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
    description: 'Sort by relevance | heaviest | lieghtest',
    example: ItemSortEnum.RELEVANCE,
  })
  sort = ItemSortEnum.RELEVANCE; // Maybe: also newest | oldest

  @IsString()
  @IsOptional()
  @Length(0, 100)
  @ApiPropertyOptional({
    minLength: 0,
    maxLength: 100,
    type: String,
    description: 'The query string to search for',
    example: 'coffee',
  })
  query: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    type: [String],
    description: 'The tags to search for',
    example: ['coffee', 'toaster'],
  })
  @Type(() => String)
  // A wise coffemakingtoaster once explained this to the frontend: "Oh I can answer that. While there is a query syntax for arrays (myField[]=abc would produce ['abc']) swagger does not use that. Instead swagger uses myfield=abc&myfield=def which when only sending one item for myField leads to myField='abc' in TS. Therefore we use [value].flat() to be able to parse a singular string as well as a string array as [['abc']].flat() and ['abc'].flat() produce the same output"
  @Transform(({ value }) => [value].flat())
  tags: string[];

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'The item slug to search for',
    example: 'item-name',
  })
  slug: string;
}
