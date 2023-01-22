import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class QueryItemListDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({ type: Number, default: 1, minimum: 1 })
  page = 1;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(64)
  @Type(() => Number)
  @ApiPropertyOptional({ type: Number, default: 16, minimum: 1 })
  limit = 16;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    enum: ['relevance', 'lightest', 'heaviest'], // This is just for show and does not clash with the no ENUM rule
    default: 'relevance',
  })
  sort = 'relevance'; // Maybe: lightest | heaviest | newest | oldest | relevance // Not an ENUM because ENUMS are inperformant and can lead to spaghetti code

  @IsString()
  @IsOptional()
  @Length(0, 100)
  @ApiPropertyOptional()
  query: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  @Type(() => String)
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  tags: string[];

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  slug: string;
}
