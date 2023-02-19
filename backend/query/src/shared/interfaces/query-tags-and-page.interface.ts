import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, Length } from 'class-validator';
import { Page } from './page.interface';

/**
 * @description Query Tags and page to extend page as it is most commonly used together
 */
export class QueryTagsAndPage extends Page {
  @IsString()
  @IsOptional()
  @Length(0, 100)
  @ApiPropertyOptional({
    minLength: 0,
    maxLength: 100,
    description: 'The query string to search for',
    example: 'apple',
  })
  query: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    isArray: true,
    description: 'The tags to search for',
    example: ['fruit'],
  })
  @Type(() => String)
  // A wise coffemakingtoaster once explained this to the frontend: "Oh I can answer that. While there is a query syntax for arrays (myField[]=abc would produce ['abc']) swagger does not use that. Instead swagger uses myfield=abc&myfield=def which when only sending one item for myField leads to myField='abc' in TS. Therefore we use [value].flat() to be able to parse a singular string as well as a string array as [['abc']].flat() and ['abc'].flat() produce the same output"
  @Transform(({ value }) => [value].flat())
  tags: string[];
}
