import { ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';

export class GlobalStatistics {
  @Expose()
  @ApiProperty({ description: 'Total items, ignoring deleted Items' })
  @prop()
  totalItems: number;

  @Expose()
  @ApiProperty({
    description: 'Total items + total contributions, ignoring deleted Items',
  })
  @prop()
  totalContributions: number;

  constructor(Partial: Partial<GlobalStatistics>) {
    Object.assign(this, Partial);
  }
}
