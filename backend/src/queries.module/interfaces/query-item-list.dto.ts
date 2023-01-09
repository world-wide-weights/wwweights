import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class QueryItemListDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  @ApiPropertyOptional({ type: Number })
  page = 1;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @ApiPropertyOptional({ minimum: 1, default: 16, type: Number })
  limit = 16;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    enum: ['relevance', 'lightest', 'heaviest', 'newest', 'oldest'],
    default: 'relevance',
  })
  sort = 'relevance'; // lightest | heaviest | newest | oldest | relevance // Not an ENUM because ENUMS are inperformant and can lead to spaghetti code

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  query: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  tags: string[];

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  slug: string;
}
