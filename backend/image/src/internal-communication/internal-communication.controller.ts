import {
  Body,
  Controller,
  forwardRef,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiKeyGuard } from '../shared/guards/api-key.guard';
import { UploadService } from '../upload/upload.service';
import { PromoteImageDTO } from './dtos/promote-image.dto';
import { RemoveImageDTO } from './dtos/remove-image.dto';

@Controller('internal')
export class InternalCommunicationController {
  constructor(
    @Inject(forwardRef(() => UploadService))
    private uploadService: UploadService,
  ) {}

  @Post('remove-image')
  @UseGuards(ApiKeyGuard)
  async removeImage(@Body() { imageHash }: RemoveImageDTO) {
    await this.uploadService.removeImageByHash(imageHash);
  }

  @Post('promote-image')
  @UseGuards(ApiKeyGuard)
  async promoteImage(@Body() { imageHash }: PromoteImageDTO) {
    await this.uploadService.promoteImage(imageHash);
  }
}
