import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ImageUploadResponse {
  @Expose()
  @ApiProperty({description: 'Image path. Used to fetch from serve endpoint'})
  path: string;
}
