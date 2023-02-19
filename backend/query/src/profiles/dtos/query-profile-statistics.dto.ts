import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

/**
 * @description
 */
export class QueryProfileStatisticsDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'The users id', example: 1 })
  userId: number;
}
