import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  forwardRef,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKeyGuard } from '../shared/guards/api-key.guard';
import { UploadService } from '../upload/upload.service';
import { DemoteImageDTO } from './dtos/demote-image.dto';
import { PromoteImageDTO } from './dtos/promote-image.dto';

@Controller('internal')
@ApiTags('internal')
@UseInterceptors(ClassSerializerInterceptor)
export class InternalCommunicationController {
  constructor(
    @Inject(forwardRef(() => UploadService))
    private uploadService: UploadService,
  ) {}

  @Post('demote-image')
  @ApiOperation({
    summary: 'Demote image',
    description:
      'INTERNAL ENDPOINT - Demote an image to be removed by cleanup processes',
  })
  @ApiBody({ type: DemoteImageDTO })
  @ApiOkResponse({
    description: 'Image has been demoted',
  })
  @ApiSecurity('api_key')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  async removeImage(@Body() { imageHash }: DemoteImageDTO): Promise<void> {
    await this.uploadService.demoteImage(imageHash);
  }

  @Post('promote-image')
  @ApiOperation({
    summary: 'Promote image',
    description:
      'INTERNAL ENDPOINT - Promote an image to be prevent removal during cleanup processes',
  })
  @ApiBody({ type: DemoteImageDTO })
  @ApiOkResponse({
    description: 'Image has been promoted',
  })
  @ApiSecurity('api_key')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  async promoteImage(@Body() { imageHash }: PromoteImageDTO): Promise<void> {
    await this.uploadService.promoteImage(imageHash);
  }
}
