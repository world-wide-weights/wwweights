import {
  Controller,
  Headers,
  HttpStatus,
  ParseFilePipe,
  Post,
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
export class UploadController {
  constructor(private readonly uplooadService: UploadService) {}

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Headers('Authorization') jwt: string,
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
    await this.uplooadService.handleImageUpload(jwt, image);
  }
}
