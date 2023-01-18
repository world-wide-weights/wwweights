import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class QueryTagListDto {
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
  sort = 'relevance'; // asc, desc, most-used, relevance // Not an ENUM because ENUMS are inperformant and can lead to spaghetti code
}
