import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { Item } from '../../models/item.model';
import { Tag } from '../../models/tag.model';
import { ImagesService } from '../services/images.service';
import { StatisticsService } from '../services/statistics.service';
import { ItemInsertedEvent } from './item-inserted.event';

@EventsHandler(ItemInsertedEvent)
export class ItemInsertedHandler implements IEventHandler<ItemInsertedEvent> {
  private readonly logger = new Logger(ItemInsertedHandler.name);
  constructor(
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
    @InjectModel(Tag)
    private readonly tagModel: ReturnModelType<typeof Tag>,
    private readonly statisticsService: StatisticsService,
    private readonly imagesService: ImagesService,
  ) {}

  async handle({ item }: ItemInsertedEvent): Promise<void> {
    // Performance
    const insertItemStartTime = performance.now();
    try {
      await this.insertItem(item);

      // No need for any tag related projection if item has no tags
      if (item.tags) {
        await this.incrementOrInsertTags(item);
        await this.updateNewItemWithCorrectTags(item);
      }

      this.logger.debug(
        `Insert took: ${performance.now() - insertItemStartTime} ms`,
      );

      await Promise.all([
        this.incrementProfileCounts(item),
        this.statisticsService.incrementGlobalItemCount(),
      ]);

      // Further updates and recovery from inconsistency is handled via cronjobs rather than for every projector run
      await this.imagesService.promoteImageInImageBackend(item.image);
    } catch (error) /* istanbul ignore next */ {
      this.logger.log(error);
      this.logger.error(
        `Toplevel error caught. Stopping execution. See above for more details`,
      );
    }

    this.logger.debug(
      `Finished in ${performance.now() - insertItemStartTime} ms`,
    );
  }

  // Db calls: 1 save()
  /**
   * @description Insert item into read db
   */
  private async insertItem(item: Item): Promise<void> {
    try {
      const insertedItem = new this.itemModel(item);
      await insertedItem.save();
      this.logger.debug(`Item inserted:  ${insertedItem.slug}`);
    } catch (error) /* istanbul ignore next */ {
      this.logger.error(`Insert Item ${item.slug}: ${error}`);
      throw new Error(`Couldn't insert item ${item.slug}`);
    }
  }

  // DB calls: 1 bulkWrite(tag amount * updateOne)
  private async incrementOrInsertTags(item: Item): Promise<void> {
    try {
      // We have to bulkwrite here because we can't use an Array filter for upserts (and it is faster than 2 writes)
      const tagsArray = item.tags.map((tag) => ({
        updateOne: {
          filter: { name: tag.name },
          update: { $inc: { count: 1 } },
          upsert: true,
        },
      }));
      await this.tagModel.bulkWrite(tagsArray);
      this.logger.log(`Tags incremented or created: ${tagsArray}`);
    } catch (error) /* istanbul ignore next */ {
      this.logger.log(
        `Acceptable Create Tags (${item.tags.join(
          ',',
        )}) BulkWriteError: ${error}`,
      );
    }
  }

  /**
   * @description Lookup tags that are in the new item from the itemModel and update the item with the correct tags
   */
  private async updateNewItemWithCorrectTags(item: Item): Promise<void> {
    const tagsNames = item.tags.map((tag) => tag.name);
    try {
      // Lookup tags and merge found values into item tags field
      await this.itemModel.aggregate([
        { $match: { slug: item.slug } },
        {
          $lookup: {
            from: 'tags',
            pipeline: [
              { $match: { name: { $in: tagsNames } } },
              { $project: { _id: 0, __v: 0 } },
            ],
            as: 'tags',
          },
        },
        { $merge: { into: 'items' } },
      ]);
    } catch (error) /* istanbul ignore next */ {
      this.logger.error(error);
      throw new Error(`Could not handle update item ${item.slug} tags`);
    }
  }

  /**
   * @description Increment the profile counts based on with what the item was created
   */
  private async incrementProfileCounts(item: Item): Promise<void> {
    const incrementer = {
      $inc: {
        'count.itemsCreated': 1,
        'count.tagsUsedOnCreation': item.tags?.length || 0,
        'count.sourceUsedOnCreation': item.source ? 1 : 0,
        'count.imageAddedOnCreation': item.image ? 1 : 0,
        'count.additionalValueOnCreation': item.weight.additionalValue ? 1 : 0,
      },
    };

    await this.statisticsService.incrementProfileCounts(
      item.userId,
      incrementer,
    );
  }
}
