import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SuggestItemDeleteDTO {
  @IsOptional()
  @IsString()
  @MaxLength(128)
  @ApiPropertyOptional({ description: 'Reason for item deletion' })
  reason?: string;
}
