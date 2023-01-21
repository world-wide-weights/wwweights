import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger } from '@nestjs/common';
import { UnprocessableEntityException } from '@nestjs/common/exceptions/unprocessable-entity.exception';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { Item } from '../../models/item.model';
import { ItemsByTag } from '../../models/items-by-tag.model';
import { Tag } from '../../models/tag.model';
import { getStringified } from '../../shared/get-stringified';
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
      There is no error handling here, because we are going for eventual consistency, in the commandHandler we tested if everything here should be fine, 
      so we expect it to be fine here, is it not it will be after we replayed the events.
    */
    try {
      // Performance
      const insertItemStartTime = performance.now();

      // Insert Item
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

      // Increment/Upsert Tags
      await this.incrementOrInsertTags(item);

      item.tags = await this.getIncrementedTags(item);

      this.logger.debug(
        `ItemInsertedHandler Insert took: ${
          performance.now() - insertItemStartTime
        }ms`,
      );

      const updateTagsStartTime = performance.now();

      await Promise.all([
        // we do this this way around instead of first inserting tags and then insert the item to have a clean cut in case the item insert fails
        this.updateItemWithCorrectTags(item),
        this.updateItemTagCounts(item),
        this.upsertItemIntoItemsByTag(item),
        this.updateItemsByTagCounts(item),
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

  // 1 updateMany 1 insertMany
  async incrementOrInsertTags(item: Item) {
    try {
      const tagsArray = item.tags.map((tag) => tag.name);
      const { newTags, existingTags } = await this.splitNewAndExistingTags(
        tagsArray,
      );
      await this.tagModel.updateMany(
        { name: { $in: existingTags } },
        { $inc: { count: 1 } },
      );
      await this.tagModel.insertMany(
        newTags.map((tag) => ({ name: tag, count: 1 })),
      );
      this.logger.log(`Tags incremented or created: ${tagsArray}`);
    } catch (error) {
      this.logger.error(`Increment/insert tags: ${error}`);
    }
  }

  // 1 save()
  async insertItem(item: Item) {
    try {
      if (item.tags.length > 0) {
      }
      this.logger.debug(`Item to insert: ${getStringified(item.tags)}`);
      const insertedItem = new this.itemModel(item);
      await insertedItem.save();
      this.logger.log(`Item inserted:  ${insertedItem.slug}`);
    } catch (error) {
      this.logger.error(`Insert Item: ${error}`);
      throw new UnprocessableEntityException("Couldn't insert item");
    }
  }

  // 1 findOneAndUpdate
  async updateItemWithCorrectTags(item: Item) {
    try {
      await this.itemModel.findOneAndUpdate(
        { slug: item.slug },
        { tags: item.tags },
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  // 1 updateMany
  async updateItemTagCounts(item: Item) {
    try {
      const tagsArray = item.tags.map((tag) => tag.name);
      const res = await this.itemModel.updateMany(
        { 'tags.name': { $in: tagsArray }, slug: { $ne: item.slug } },
        { $inc: { 'tags.$.count': 1 } },
      );
      this.logger.log(`Items updated: ${getStringified(res)}`);
      this.logger.log(
        `Item count incremented for tags in items, tag: ${tagsArray}`,
      );
    } catch (error) {
      this.logger.error(`Update Item.tags counts: ${error}`);
    }
  }

  // 1 insertMany 1 updateMany
  async upsertItemIntoItemsByTag(item: Item) {
    try {
      const newTags = item.tags
        .filter((tag) => tag.count === 1)
        .map(
          (tag) =>
            new this.itemsByTagModel({ tagName: tag.name, items: [item] }),
        );
      await this.itemsByTagModel.insertMany(newTags);
      this.logger.log(
        `ItemsByTag created for tags: ${newTags.map((tag) => tag.tagName)}`,
      );
    } catch (error) {
      this.logger.error(`Create ItemsByTags: ${error}`);
    }

    try {
      const existingTags = item.tags
        .filter((tag) => tag.count > 1)
        .map((tag) => tag.name);
      await this.itemsByTagModel.updateMany(
        { tagName: { $in: existingTags } },
        { $push: { items: item } },
      );
    } catch (error) {
      this.logger.error(`Insert item to ItemsByTag: ${error}`);
    }
  }

  // 1 updateMany
  async updateItemsByTagCounts(item: Item) {
    try {
      const tagsArray = item.tags.map((tag) => tag.name);
      await this.itemsByTagModel.updateMany(
        {},
        { $inc: { 'items.$[item].tags.$[tag].count': 1 } },
        {
          arrayFilters: [
            { 'item.slug': { $ne: item.slug } },
            { 'tag.name': { $in: tagsArray } },
          ],
        },
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  // 1 find
  async getIncrementedTags(item: Item) {
    const tagsArray = item.tags.map((tag) => tag.name);
    const currentTags = await this.tagModel.find(
      {
        name: { $in: tagsArray },
      },
      { name: 1, count: 1 },
    );
    return currentTags;
  }

  // 1 find
  async splitNewAndExistingTags(tagsArray: string[]) {
    const tagsInDb = await this.tagModel.find(
      {
        name: { $in: tagsArray },
      },
      { name: 1 },
    );
    const existingTags = tagsInDb.map((tag) => tag.name);
    const newTags = tagsArray.filter((x) => !existingTags.includes(x));
    return { newTags, existingTags };
  }
}
