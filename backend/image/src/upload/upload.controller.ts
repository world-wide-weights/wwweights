import {
  ClassSerializerInterceptor,
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
import { ApiBearerAuth, ApiBody, ApiConflictResponse, ApiConsumes, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiServiceUnavailableResponse, ApiTags, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../shared/guards/jwt.guard';
import { ImageUploadConflictError } from './responses/upload-image-conflict.error';
import { ImageUploadResponse } from './responses/upload-image.response';
import { UploadService } from './upload.service';
import { FileSizeValidator } from './validators/file-size.validator';
import { FileTypeValidator } from './validators/file-type.validator';

@Controller('upload')
@ApiTags('upload')
@UseInterceptors(ClassSerializerInterceptor)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload image' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBearerAuth('jwt')
  @ApiCreatedResponse({type: ImageUploadResponse, description: 'Sucessfully uploaded image'})
  @ApiConflictResponse({description: 'Image has already been uploaded', type: ImageUploadConflictError })
  @ApiServiceUnavailableResponse({description: 'Auth backend could not be reached'})
  @ApiUnauthorizedResponse({description: 'Passed JWT was invalid'})
  @ApiUnprocessableEntityResponse({description: 'Image is either too big (max. 2 MB) or in an unsupported format (png, jpeg, jpg)'})
  @ApiInternalServerErrorResponse({description: 'Image parsing failed internally'})
  async uploadImage(
    // This sadly leads to an authorization header being required within swagger in addtition to the setup BearerAuth
    // While this makes swagger slightly confusing it is the cleanest way to do this in the code
    @Headers('Authorization') jwt: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileSizeValidator({ maxFileSizeInMb: 2 }),
          new FileTypeValidator({
            supportedFileTypes: ['image/jpeg', 'image/png'],
          }),
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    image: Express.Multer.File,
  ): Promise<ImageUploadResponse> {
    return await this.uploadService.handleImageUpload(jwt, image);
  }
}
