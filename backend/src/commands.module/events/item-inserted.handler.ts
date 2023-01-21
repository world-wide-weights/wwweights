import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger } from '@nestjs/common';
import { UnprocessableEntityException } from '@nestjs/common/exceptions/unprocessable-entity.exception';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { Item } from '../../models/item.model';
import { ItemsByTag } from '../../models/items-by-tag.model';
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

      const updateTagsStartTime = performance.now();
      await this.upsertItemIntoItemsByTag(item);

      // TODO: The following 2 calls can be outsourced as chronjobs.
      // TODO: We failed to find a better solution with just "increments $inc" to update the counts, because this does lead to counting errors when multiple items are inserted at the same time.
      // TODO: But this is fine because its a write db with eventual consistency, we can say something like every 5 minutes or every few hundred items and have "possibly wrong counts before that"
      await Promise.all([
        this.updateAllItemTagCounts(),
        this.updateAllItemsByTagCounts(),
      ]);

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
      if (item.tags.length > 0) {
      }
      const insertedItem = new this.itemModel(item);
      await insertedItem.save();
      this.logger.log(`Item inserted:  ${insertedItem.slug}`);
    } catch (error) {
      this.logger.error(`Insert Item: ${error}`);
      throw new UnprocessableEntityException("Couldn't insert item");
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
      this.logger.error(`Increment/insert tags: ${error}`);
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

  // Looksup all the tags the item has from the tagModel and updates its array
  async updateAllItemTagCounts() {
    try {
      // Here an aggregate because for some reason a $lookup and then $set did not update the document in a model.findOneAndUpdate()
      await this.itemModel.aggregate([
        {
          $lookup: {
            from: 'tags',
            let: {
              tagNames: {
                $map: { input: '$tags', as: 'tag', in: '$$tag.name' },
              },
            },
            pipeline: [
              { $match: { $expr: { $in: ['$name', '$$tagNames'] } } },
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

  // DB calls: 1 updateMany
  // async incrementOtherItemTagCounts(item: Item) {
  //   try {
  //     const tagsArray = item.tags.map((tag) => tag.name);
  //     const res = await this.itemModel.updateMany(
  //       { 'tags.name': { $in: tagsArray }, slug: { $ne: item.slug } },
  //       { $inc: { 'tags.$.count': 1 } },
  //     );
  //     this.logger.log(`Items updated: ${getStringified(res)}`);
  //     this.logger.log(
  //       `Item count incremented for tags in items, tag: ${tagsArray}`,
  //     );
  //   } catch (error) {
  //     this.logger.error(`Update Item.tags counts: ${error}`);
  //   }
  // }

  // DB Calls: 1 insertMany, 1 updateMany
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
      this.logger.warn(`Create ItemsByTags: ${error}`);
    }

    try {
      // $lookup is not available on updateMany yet, so we have to use an aggregate
      const tagsNames = item.tags.map((tag) => tag.name);
      // TODO: Consider a bulkwrite to concat the two underlying calls this.itemsByTagModel.bulkWrite([]);
      await this.itemsByTagModel.aggregate([
        {
          $match: { tagName: { $in: tagsNames } },
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
    }
  }

  // Lookup all the items the itemsByTags has from the itemModel and updates its array
  async updateAllItemsByTagCounts() {
    // Since other items can be inserted in the meantime, causing the count to be off, we can't go for the fastest solution of $inc, but have to actually fetch the data again.
    // This is fine since it is a readDB and doesn't have to be written on fast
    try {
      await this.itemsByTagModel.aggregate([
        {
          $lookup: {
            from: 'items',
            let: {
              slugs: {
                $map: { input: '$items', as: 'item', in: '$$item.slug' },
              },
            },
            pipeline: [
              { $match: { $expr: { $in: ['$slug', '$$slugs'] } } },
              { $project: { _id: 0, __v: 0 } },
            ],
            as: 'items',
          },
        },
        {
          $merge: {
            into: 'itemsbytags',
          },
        },
      ]);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
