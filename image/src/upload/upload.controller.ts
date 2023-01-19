import {
  Controller,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidator } from './validators/file-size-validation.pipe';
import { FileTypeValidationPipe } from './validators/file-type-Validation.pipe';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uplooadService: UploadService) {}

  @Post('image')
  //@UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    // @Req() user: RequestWithUser,
    @UploadedFile(
     // new ParseFilePipe({
     //   validators: [new FileSizeValidator({ maxFileSizeInMb: 1 })],
     //   errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    // }),
    )
    image: Express.Multer.File,
  ) {
    await this.uplooadService.handleImageUpload(null, image);
  }
}
