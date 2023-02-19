import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { AnyBulkWriteOperation } from 'mongodb';
import {
  SuggestionItem,
  SuggestionTag,
} from '../../models/edit-suggestion.model';
import { Item } from '../../models/item.model';
import { Tag } from '../../models/tag.model';
import { ImagesService } from '../services/images.service';
import { StatisticsService } from '../services/statistics.service';
import { ItemEditedEvent } from './item-edited.event';

@EventsHandler(ItemEditedEvent)
export class ItemEditedHandler implements IEventHandler<ItemEditedEvent> {
  private readonly logger = new Logger(ItemEditedHandler.name);
  constructor(
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
    @InjectModel(Tag)
    private readonly tagModel: ReturnModelType<typeof Tag>,
    private readonly imagesService: ImagesService,
    private readonly statisticsService: StatisticsService,
  ) {}

  async handle({ itemEditedEventDto }: ItemEditedEvent): Promise<void> {
    const updateItemStartTime = performance.now();
    const { itemSlug, editValues } = itemEditedEventDto;

    try {
      const oldItem = await this.updateItem(itemSlug, editValues);

      this.logger.debug(
        `Item update took: ${performance.now() - updateItemStartTime} ms`,
      );
      await this.incrementProfileCounts(
        itemEditedEventDto.userId,
        itemEditedEventDto.editValues,
      );

      // No tags in suggestion => we are done here
      if (editValues.tags) {
        const updateTagsStartTime = performance.now();
        await this.updateTags(editValues.tags);
        this.logger.debug(
          `Updating tags by themselves took ${
            performance.now() - updateTagsStartTime
          } ms`,
        );
      }
      if (editValues.image && oldItem?.image) {
        const imgBackendCallStartTime = performance.now();
        // Only remove as promotion of new image was done at suggestion creation
        await this.imagesService.demoteImageInImageBackend(oldItem.image),
          this.logger.debug(
            `Finished Image backend api call in ${
              performance.now() - imgBackendCallStartTime
            } ms`,
          );
      }
    } catch (error) /* istanbul ignore next */ {
      this.logger.error(error);
      this.logger.error(
        `Toplevel error caught. Stopping execution. See above for more details`,
      );
    }
    this.logger.debug(
      `Finished in ${performance.now() - updateItemStartTime} ms`,
    );
  }

  // Db calls: Min: 1 findOneAndUpdate Max: 2 findOneAndUpdate()
  private async updateItem(
    slug: string,
    itemData: SuggestionItem,
  ): Promise<Item> {
    const { tags: tagsValues, weight, ...itemValues } = itemData;
    const tagNamesToPull = tagsValues?.pull || [];
    const tagsToPush =
      // Use value of 1 as count, as these are updated by cronjob later on
      tagsValues?.push?.map((tag) => ({ name: tag, count: 1 })) || [];
    const weightSet = {};
    if (weight !== undefined) {
      // Generate object for nested update
      // Format as described in: https://www.mongodb.com/docs/manual/reference/operator/update/set/#set-fields-in-embedded-documents
      Object.keys(weight).forEach((key) => {
        weightSet[`weight.${key}`] = weight[key];
      });
    }

    try {
      const oldItem = await this.itemModel.findOneAndUpdate(
        { slug },
        {
          ...itemValues,
          $pull: { tags: { name: { $in: tagNamesToPull } } },
          $set: weightSet,
        },
      );

      if (tagsToPush.length > 0) {
        await this.itemModel.findOneAndUpdate(
          { slug },
          {
            $addToSet: { tags: tagsToPush },
          },
        );
      }
      return oldItem;
    } catch (error) /* istanbul ignore next */ {
      this.logger.error(
        `Could not update item ${slug} due to an error ${error}`,
      );
      throw new Error(`Item ${slug} could not be updated`);
    }
  }

  // Db calls: 1 bulkwrite()
  /**
   * @description Update Tags
   */
  private async updateTags(tagUpdate: SuggestionTag): Promise<void> {
    // Construct query
    const positiveUpdateQuery: AnyBulkWriteOperation<Tag>[] =
      tagUpdate.push?.map((tagName) => ({
        updateOne: {
          filter: { name: tagName },
          update: { $inc: { count: 1 } },
          upsert: true,
        },
      })) || [];
    // Construct query
    const negativeUpdateQuery: AnyBulkWriteOperation<Tag>[] =
      tagUpdate.pull?.map((tagName) => ({
        updateOne: {
          filter: { name: tagName },
          update: { $inc: { count: -1 } },
        },
      })) || [];

    try {
      await this.tagModel.bulkWrite(
        positiveUpdateQuery.concat(negativeUpdateQuery),
      );
    } catch (error) /* istanbul ignore next */ {
      this.logger.error(
        `Could not update Tags ${tagUpdate.push.concat(
          tagUpdate.pull,
        )} due to an error ${error}`,
      );
      throw new Error(`Could not update tags ${tagUpdate.pull?.concat()}`);
    }
  }

  /**
   * @description Increment the profile counts based edited values
   */
  private async incrementProfileCounts(
    userId: number,
    editValues: SuggestionItem,
  ): Promise<void> {
    const incrementer = {
      $inc: {
        'count.itemsUpdated': 1,
        'count.tagsUsedOnUpdate': editValues.tags?.push?.length || 0,
        'count.sourceUsedOnUpdate': editValues.source ? 1 : 0,
        'count.imageAddedOnUpdate': editValues.image ? 1 : 0,
        'count.additionalValueOnUpdate': editValues.weight?.additionalValue
          ? 1
          : 0,
      },
    };
    const time = performance.now();
    await this.statisticsService.incrementProfileCounts(userId, incrementer);
  }
}
