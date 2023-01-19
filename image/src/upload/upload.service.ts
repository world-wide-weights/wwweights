import { Injectable } from '@nestjs/common';
import { RequestWithUser } from 'src/shared/interfaces/request-with-user.interface';

@Injectable()
export class UploadService {
  handleImageUpload(user: RequestWithUser, image: Express.Multer.File) {
    console.log(user);
    console.log(image.filename);
  }
}
