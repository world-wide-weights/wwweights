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
import { DemoteImageDTO } from './dtos/demote-image.dto';
import { PromoteImageDTO } from './dtos/promote-image.dto';

@Controller('internal')
export class InternalCommunicationController {
  constructor(
    @Inject(forwardRef(() => UploadService))
    private uploadService: UploadService,
  ) {}

  @Post('demote-image')
  @UseGuards(ApiKeyGuard)
  async removeImage(@Body() { imageHash }: DemoteImageDTO) {
    await this.uploadService.demoteImage(imageHash);
  }

  @Post('promote-image')
  @UseGuards(ApiKeyGuard)
  async promoteImage(@Body() { imageHash }: PromoteImageDTO) {
    await this.uploadService.promoteImage(imageHash);
  }
}
