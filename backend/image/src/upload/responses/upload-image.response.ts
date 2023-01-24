import { Expose } from 'class-transformer';

export class ImageUploadResponse {
  @Expose()
  path: string;
}
