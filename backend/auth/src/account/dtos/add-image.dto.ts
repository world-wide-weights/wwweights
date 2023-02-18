import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * @description DTO for connection an image to a user
 */
export class AddImageDto {
  @IsString()
  @ApiProperty({ description: 'Image hash with filending for the uploaded image', example: 'a9afebc66b023b5b6cdfb678e8adfc068137d7887b633bc87f37885e013fd7b6.png' })
  imageHash: string;
}
