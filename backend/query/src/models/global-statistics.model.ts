import { ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { Expose, Transform } from 'class-transformer';

export class GlobalStatistics {
  @Expose()
  @ApiProperty({ description: 'Total active items' })
  @prop()
  totalItems: number;

  @prop()
  totalSuggestions: number;

  @Expose()
  @ApiProperty({
    description: 'Total items + total suggestions',
  })
  @Transform(({ obj }) => obj.totalItems + obj.totalSuggestions)
  totalContributions: number;

  constructor(Partial: Partial<GlobalStatistics>) {
    Object.assign(this, Partial);
  }
}
