import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { Item } from '../../models/item.model';
import { Tag } from '../../models/tag.model';
import { ImagesService } from '../services/images.service';
import { StatisticsService } from '../services/statistics.service';
import { ItemDeletedEvent } from './item-deleted.event';

@EventsHandler(ItemDeletedEvent)
export class ItemDeletedHandler implements IEventHandler<ItemDeletedEvent> {
  private readonly logger = new Logger(ItemDeletedHandler.name);
  constructor(
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
    @InjectModel(Tag)
    private readonly tagModel: ReturnModelType<typeof Tag>,
    private readonly statisticsService: StatisticsService,
    private readonly imagesService: ImagesService,
  ) {}

  async handle({ itemDeletedEventDto }: ItemDeletedEvent): Promise<void> {
    const { itemSlug } = itemDeletedEventDto;

    const deleteItemStartTime = performance.now();
    try {
      // Storing item information within the code is valid here as it cant change anymore
      const deletedItem: Item = await this.deleteItem(itemSlug);

      this.logger.debug(
        `Item delete took: ${performance.now() - deleteItemStartTime} ms`,
      );

      await Promise.all([
        this.statisticsService.decrementGlobalItemCount(),
        this.incrementProfileCounts(itemDeletedEventDto.userId),
      ]);

      if (deletedItem?.tags) {
        const updateTagsStartTime = performance.now();
        const tagNames = deletedItem.tags.map((tag) => tag.name);
        await this.decrementTags(tagNames);
        this.logger.debug(
          `Tag update took: ${performance.now() - updateTagsStartTime} ms`,
        );
      }

      await this.imagesService.demoteImageInImageBackend(deletedItem?.image);
    } catch (error) {
      this.logger.error(
        `Toplevel error caught. Stopping execution. See above for more details`,
      );
    }

    this.logger.log(`Finished in ${performance.now() - deleteItemStartTime}`);
  }

  /**
   * @description Delete item in read DB
   */
  private async deleteItem(slug: string): Promise<Item> {
    try {
      return await this.itemModel.findOneAndDelete({ slug });
    } catch (error) {
      this.logger.error(
        `Could not delete item ${slug} due to an error ${error}`,
      );
      throw new Error(`Could not delete item ${slug}`);
    }
  }

  /**
   * @description Decrement Tags by given names
   */
  private async decrementTags(tagNames: string[]): Promise<void> {
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
      throw new Error('Could not update tags');
    }
  }

  /**
   * @description Increment the profile counts for itemDeletes
   */
  private async incrementProfileCounts(userId: number): Promise<void> {
    const incrementer = { $inc: { 'count.itemsDeleted': 1 } };

    await this.statisticsService.incrementProfileCounts(userId, incrementer);
  }
}
