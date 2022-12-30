import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class QueryItemListDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  @ApiPropertyOptional()
  page = 1;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  limit = 16;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
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
