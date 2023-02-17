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
import { ApiKeyGuard } from '../shared/guards/api-key.guard';
import { UploadService } from '../upload/upload.service';
import { DemoteImageDTO } from './dtos/demote-image.dto';
import { PromoteImageDTO } from './dtos/promote-image.dto';

@Controller('internal')
@UseInterceptors(ClassSerializerInterceptor)
export class InternalCommunicationController {
  constructor(
    @Inject(forwardRef(() => UploadService))
    private uploadService: UploadService,
  ) {}

  @Post('demote-image')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  async removeImage(@Body() { imageHash }: DemoteImageDTO) {
    await this.uploadService.demoteImage(imageHash);
  }

  @Post('promote-image')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  async promoteImage(@Body() { imageHash }: PromoteImageDTO) {
    console.log('daksdakd');
    await this.uploadService.promoteImage(imageHash);
  }
}
