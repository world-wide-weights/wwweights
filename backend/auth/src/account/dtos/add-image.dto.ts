import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddImageDto {
  @IsString()
  @ApiProperty({ description: 'Image hash for the uploaded image' })
  imageHash: string;
}
