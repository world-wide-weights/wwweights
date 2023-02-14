import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class QueryProfileStatisticsDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The users id', example: 1 })
  userId: number;
}
