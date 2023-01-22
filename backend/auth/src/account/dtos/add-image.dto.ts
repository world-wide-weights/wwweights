import { IsString } from 'class-validator';

export class AddImageDto {
  @IsString()
  imageHash: string;
}
