import { InjectModel } from '@m8a/nestjs-typegoose';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { InternalCommunicationService } from '../../internal-communication/internal-communication.service';
import { Item } from '../../models/item.model';
import { Tag } from '../../models/tag.model';
import { IsUrl } from '../../shared/functions/is-url';
import { ItemDeletedEvent } from './item-deleted.event';

@EventsHandler(ItemDeletedEvent)
export class ItemDeletedHandler implements IEventHandler<ItemDeletedEvent> {
  private readonly logger = new Logger(ItemDeletedHandler.name);
  constructor(
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
    @InjectModel(Tag)
    private readonly tagModel: ReturnModelType<typeof Tag>,
    private readonly internalCommunicationService: InternalCommunicationService,
  ) {}
  async handle({ itemDeletedEventDto }: ItemDeletedEvent) {
    const { itemSlug } = itemDeletedEventDto;

    const deleteItemStartTime = performance.now();

    // Storing item information here is valid as it cant change anymore
    const deletedItem: Item = await this.deleteItem(itemSlug);

    this.logger.debug(
      `${ItemDeletedHandler.name} Item delete took: ${
        performance.now() - deleteItemStartTime
      }ms`,
    );

    if (deletedItem?.tags) {
      const updateTagsStartTime = performance.now();

      const tagNames = deletedItem.tags.map((tag) => tag.name);

      await this.updateTags(tagNames);
      this.logger.debug(
        `${ItemDeletedHandler.name} Tag update took: ${
          performance.now() - updateTagsStartTime
        }ms`,
      );
    }

    await this.removeImage(deletedItem.image);

    this.logger.log(
      `${ItemDeletedHandler.name} finished in ${
        performance.now() - deleteItemStartTime
      }`,
    );
  }

  async deleteItem(slug: string) {
    try {
      const oldItem = await this.itemModel.findOneAndDelete({ slug });
      return oldItem;
    } catch (error) {
      this.logger.error(
        `Could not delete item ${slug} due to an error ${error}`,
      );
      throw new InternalServerErrorException(`Could not delete item ${slug}`);
    }
  }

  async updateTags(tagNames: string[]) {
    try {
      await this.tagModel.updateMany(
        { name: { $in: tagNames } },
        {
          $inc: { count: -1 },
        },
      );
    } catch (error) {
      this.logger.error(
        `Could not update Tags ${tagNames.join(',')} due to an error ${error}`,
      );
      throw new InternalServerErrorException('Could not update tags');
    }
  }

  private async removeImage(imageValue: string) {
    if (IsUrl(imageValue)) {
      // Image was external => No deletion needed
      return;
    }
    this.internalCommunicationService.notifyImgImageObsoleteness(imageValue);
  }
}
