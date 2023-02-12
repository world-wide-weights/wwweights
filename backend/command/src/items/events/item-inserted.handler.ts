import { InjectModel } from '@m8a/nestjs-typegoose';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { Item } from '../../models/item.model';
import { ItemsByTag } from '../../models/items-by-tag.model';
import { Profile } from '../../models/profile.model';
import { Tag } from '../../models/tag.model';
import { ItemInsertedEvent } from './item-inserted.event';

@EventsHandler(ItemInsertedEvent)
export class ItemInsertedHandler implements IEventHandler<ItemInsertedEvent> {
  private readonly logger = new Logger(ItemInsertedHandler.name);
  constructor(
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
    @InjectModel(Tag)
    private readonly tagModel: ReturnModelType<typeof Tag>,
    @InjectModel(ItemsByTag)
    private readonly itemsByTagModel: ReturnModelType<typeof ItemsByTag>,
    @InjectModel(Profile)
    private readonly profileModel: ReturnModelType<typeof Profile>,
  ) {}
  async handle({ item }: ItemInsertedEvent) {
    /*
      We have to make multiple calls, because we have circular dependencies   
      There are multiple options to either first create the item or first increment the tags, we decided to go for the latter.
      We expect all performed actions within this to be valid as they have been verified by the Commandhandler. If an error occurs regardless it merely indicates that an eventstore replay (and therefore ReadDB rebuild) is necessary
      so we expect it to be fine here, is it not it will be after we replayed the events.
    */
    try {
      // Performance
      const insertItemStartTime = performance.now();

      await this.insertItem(item);

      // No need for any tag related projection if item has no tags
      if (!item.tags) {
        this.logger.debug(
          `ItemInsertedHandler Insert took: ${
            performance.now() - insertItemStartTime
          }ms`,
        );
        return;
      }

      await this.incrementOrInsertTags(item);
      await this.updateNewItemWithCorrectTags(item);

      this.logger.debug(
        `ItemInsertedHandler Insert took: ${
          performance.now() - insertItemStartTime
        }ms`,
      );

      // This is not a SAGA since it is unreasonable to save this in an eventstore
      this.increamentProfileCounts(item);

      const updateTagsStartTime = performance.now();
      await this.upsertItemIntoItemsByTag(item);

      // Further updates and recovery from inconsistency is handled via cronjobs rather than for every projector run

      this.logger.debug(
        `ItemInsertedHandler Updates took: ${
          performance.now() - updateTagsStartTime
        }ms`,
      );
    } catch (error) {
      this.logger.error(`ItemInsertedHandler TopLevel caught error: ${error}`);
    }
  }

  // Db calls: 1 save()
  async insertItem(item: Item) {
    try {
      if (item.tags?.length > 0) {
      }
      const insertedItem = new this.itemModel(item);
      await insertedItem.save();
      this.logger.log(`Item inserted:  ${insertedItem.slug}`);
    } catch (error) {
      this.logger.error(`Insert Item: ${error}`);
      throw new InternalServerErrorException("Couldn't insert item");
    }
  }

  // DB calls: 1 bulkWrite(tag amount * updateOne)
  async incrementOrInsertTags(item: Item) {
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
    } catch (error) {
      this.logger.log(`Acceptable Create ItemsByTags BulkWriteError: ${error}`);
    }
  }

  // Lookup tags that are in the new item from the itemModel and update the item with the correct tags
  async updateNewItemWithCorrectTags(item: Item) {
    try {
      const tagsNames = item.tags.map((tag) => tag.name);
      // Here an aggregate because for some reason a $lookup and then $set did not update the document in a model.findOneAndUpdate()
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
    } catch (error) {
      this.logger.error(error);
    }
  }

  // DB Calls: 1 insertMany, 1 aggregate
  async upsertItemIntoItemsByTag(item: Item) {
    try {
      // await this.itemsByTagModel.bulkWrite(tagsArray);
      const newTags = item.tags.map(
        (tag) => new this.itemsByTagModel({ tagName: tag.name }),
      );
      await this.itemsByTagModel.insertMany(newTags, { ordered: false });
      this.logger.log(
        `ItemsByTag created for tags: ${newTags.map((tag) => tag.tagName)}`,
      );
    } catch (error) {
      this.logger.log(`Acceptable Create ItemsByTags BulkWriteError: ${error}`);
    }

    try {
      // $lookup is not available on updateMany yet, so we have to use an aggregate
      const tagNames = item.tags.map((tag) => tag.name);
      await this.itemsByTagModel.aggregate([
        {
          $match: { tagName: { $in: tagNames } },
        },
        {
          $lookup: {
            from: 'items',
            pipeline: [
              { $match: { slug: item.slug } },
              { $project: { _id: 0, __v: 0 } },
            ],
            as: 'newItem',
          },
        },
        { $set: { items: { $concatArrays: ['$items', '$newItem'] } } },
        { $unset: ['newItem'] },
        { $merge: { into: 'itemsbytags' } },
      ]);
    } catch (error) {
      this.logger.error(`Insert item to ItemsByTag: ${error}`);
      // TODO: Theoretically we should spawn a saga here to fix things, but this error is ultimately unlikely
      throw new InternalServerErrorException(
        "Couldn't insert item to ItemsByTag",
      );
    }
  }

  async increamentProfileCounts(item: Item) {
    const incrementer = {
      $inc: {
        'count.itemsCreated': 1,
        'count.tagsUsedOnCreation': item.tags.length,
        'count.sourceUsedOnCreation': item.source ? 1 : 0,
        'count.imageAddedOnCreation': item.image ? 1 : 0,
        'count.additionalValueOnCreation': item.weight.additionalValue ? 1 : 0,
      },
    };

    try {
      await this.profileModel.findOneAndUpdate(
        { userId: item.userId },
        incrementer,
        {
          upsert: true,
        },
      );
    } catch (error) {
      this.logger.error(`Incrementing Profile Counts Failed: ${error}`);
    }
  }
}
