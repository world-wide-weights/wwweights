import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class QueryItemStatisticsDto {
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
