import {
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
import { RequestWithUser } from '../shared/interfaces/request-with-user.interface';
import { UploadService } from './upload.service';
import { FileSizeValidator } from './validators/file-size.validator';
import { FileTypeValidator } from './validators/file-type.validator';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Req() { user }: RequestWithUser,
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
  ): Promise<string> {
    return await this.uploadService.handleImageUpload(user, image);
  }
}
