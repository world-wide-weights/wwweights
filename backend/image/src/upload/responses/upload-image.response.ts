import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

/**
 * @description Response for a successful upload containing the necessary information for finding the image within the image backend
 */
export class ImageUploadResponse {
  @Expose()
  @ApiProperty({
    description: 'Image path. Used to fetch from serve endpoint',
    example: 'kfgaujncroaehiopxafywogfawenuhdanwegxiawey.jpg',
  })
  path: string;
}
