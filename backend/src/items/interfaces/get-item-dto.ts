import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetItemDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
