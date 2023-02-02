import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Page } from '../../shared/page';

export class QueryTagRelatedDto extends Page {
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
