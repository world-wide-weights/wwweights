import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class QueryTagRelatedDto {
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
  query: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  tags: string[];
}
