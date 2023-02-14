import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GlobalStatistics {
  @Expose()
  totalItems: number;
  @Expose()
  @ApiProperty({
    description: 'Total items + total contributions, ignoring deleted Items',
  })
  totalContributions: number;

  constructor(totalItems: number, totalEditContributions: number) {
    this.totalItems = totalItems;
    this.totalContributions = totalEditContributions + totalItems;
  }
}
