import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

/**
 * @description Response for user centered statistics
 */
export class AuthStatisticsResponse {
  @Expose()
  @ApiProperty({
    description: 'Amount of registered users',
    type: Number,
    example: 69420,
  })
  totalUsers: number;

  constructor(data: Partial<AuthStatisticsResponse>) {
    Object.assign(this, data);
  }
}
