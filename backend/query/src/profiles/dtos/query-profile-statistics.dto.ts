import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

/**
 * @description The QueryProfileStatisticsDto contains the userId for which statistics are requested for
 */
export class QueryProfileStatisticsDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'The users id', example: 1 })
  userId: number;
}
