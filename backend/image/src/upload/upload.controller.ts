import {
  ClassSerializerInterceptor,
  Controller,
  HttpStatus,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../shared/guards/jwt.guard';
import { UploadService } from './upload.service';
import { FileSizeValidator } from './validators/file-size.validator';
import { FileTypeValidator } from './validators/file-type.validator';

@Controller('upload')
@UseInterceptors(ClassSerializerInterceptor)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Req() request: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileSizeValidator({ maxFileSizeInMb: 1 }),
          new FileTypeValidator({
            supportedFileTypes: ['image/jpeg', 'image/png'],
          }),
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    image: Express.Multer.File,
  ) {
    // We can assume that jwt exists, as otherwise request would have been blocked by guard
    const jwt = request.headers.get('Authorization');
    await this.uplooadService.handleImageUpload(jwt, image);
  }
}
