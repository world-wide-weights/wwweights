import { InjectModel } from '@m8a/nestjs-typegoose';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { EventStore } from '../../eventstore/eventstore';
import { InternalCommunicationService } from '../../internal-communication/internal-communication.service';
import { Item } from '../../models/item.model';
import { IsUrl } from '../../shared/functions/is-url';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);
  constructor(
    private readonly eventStore: EventStore,
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
    private readonly internalCommunicationService: InternalCommunicationService,
  ) {}

  async promoteImageInImageBackend(imageValue: string) {
    if (!this.eventStore.isReady) {
      this.logger.debug(`Skipping image obsoleteness check in replay`);
      return;
    }
    // Is image from our image backend?
    if (IsUrl(imageValue)) {
      return;
    }
    // Notify that image is now in use => It should not become a victim of cleanup procedure
    try {
      await this.internalCommunicationService.notifyImgAboutItemCreation(
        imageValue,
      );
    } catch (error) {
      this.logger.error(
        `Could not notify image backend due to an error ${error}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Image backend could not be notified',
      );
    }
  }

  async demoteImageInImageBackend(imageValue: string) {
    if (!this.eventStore.isReady) {
      this.logger.debug(`Skipping image obsoleteness check in replay`);
      return;
    }
    if (IsUrl(imageValue)) {
      // Image was external => No deletion needed
      return;
    }

    // Check if image is obsolete
    if ((await this.itemModel.countDocuments({ image: imageValue })) > 0) {
      this.logger.log(`Image ${imageValue} not obsolete`);
      return;
    }
    this.internalCommunicationService.notifyImgImageObsoleteness(imageValue);
    this.logger.debug(
      `Image backend notified that ${imageValue} has become obsolete`,
    );
  }
}
