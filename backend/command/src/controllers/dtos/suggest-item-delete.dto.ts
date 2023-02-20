import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * @description DTO for suggesting item deletion
 */
export class SuggestItemDeleteDTO {
  @IsOptional()
  @IsString()
  @MaxLength(128)
  @ApiPropertyOptional({
    description: 'Reason for item deletion',
    example: 'Duplicate',
  })
  reason?: string;
}
