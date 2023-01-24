import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, Length } from 'class-validator';

export class QueryItemStatisticsDto {
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
}
