import { ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { Expose, Transform } from 'class-transformer';

/**
 * @description Global statistics
 */
export class GlobalStatistics {
  @Expose()
  @ApiProperty({ description: 'Total active items', example: 69 })
  @prop()
  totalItems: number;

  @prop()
  totalSuggestions: number;

  @Expose()
  @ApiProperty({
    description: 'Total items + total suggestions',
    example: 420,
  })
  @Transform(({ obj }) => obj.totalItems + obj.totalSuggestions)
  totalContributions: number;

  constructor(Partial: Partial<GlobalStatistics>) {
    Object.assign(this, Partial);
  }
}
