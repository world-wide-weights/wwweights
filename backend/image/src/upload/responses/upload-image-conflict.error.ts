import { ApiProperty } from '@nestjs/swagger';

/**
 * @description Response for edge case where an image already exists within the image store
 */
export class ImageUploadConflictError {
  @ApiProperty({
    description: 'Message containing conflict reason',
    example: 'Image already exists',
  })
  message: string;

  @ApiProperty({
    description: 'Path of the image to be fetched from serve endpoint',
    example: 'abcdefg.png',
  })
  path: string;
}