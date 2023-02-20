import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

/**
 * @description Page for paginated results
 */
export class Page {
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  page = 1;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(64)
  @Type(() => Number)
  @ApiPropertyOptional({ default: 16, minimum: 1, maximum: 64 })
  limit = 16;
}
