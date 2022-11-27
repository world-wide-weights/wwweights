import { IsNotEmpty, IsString } from 'class-validator';

export class GetItemDto {
  @IsString()
  @IsNotEmpty()
  slug: string;
}
