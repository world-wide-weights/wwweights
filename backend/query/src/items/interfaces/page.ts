import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class Page {
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
}
