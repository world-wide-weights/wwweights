import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class QueryItemRelatedDto {
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
  @ApiProperty()
  slug: string;
}
