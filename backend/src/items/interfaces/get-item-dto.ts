import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetItemDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
