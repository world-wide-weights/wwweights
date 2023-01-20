import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger } from '@nestjs/common';
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
    We either have to increment first and retrieve the tags to create the item correctly.
    Or create the item first and after incrementing tags update that Item with the correct values.
    We decided to go with the first solution to have one less db call but 1 more if.
    */

    const startTime = performance.now();

    // Insert Item
    const insertedItem = new this.itemModel(item);
    try {
      await insertedItem.save();
      this.logger.log(`Item inserted:  ${insertedItem.slug}`);
    } catch (error) {
      this.logger.error(error);
    }

    // No need for any tag related projection if item has no tags
    if (!item.tags) {
      this.logger.debug(
        `ItemInsertedHandler Insert took: ${performance.now() - startTime}ms`,
      );
      return;
    }

    // Increment/Upsert Tags
    item.tags = await this.incrementOrInsertTags(item);

    this.logger.debug(
      `ItemInsertedHandler Insert took: ${performance.now() - startTime}ms`,
    );

    const startTime2 = performance.now();

    await Promise.all([
      // we do this this way around instead of first inserting tags and then insert the item, we get one more db call, but it is a fast one and it enables us to have everything behind the if(!tags)
      this.updateItemWithCorrectTags(item),
      this.updateItemTagCounts(item),
      this.createItemsByTagsOrInsertItem(item),
      this.updateItemsByTagCounts(item),
    ]);

    this.logger.debug(
      `ItemInsertedHandler Updates took: ${performance.now() - startTime2}ms`,
    );
  }

  async incrementOrInsertTags(item: Item) {
    const tags = [];
    for (const { name } of item.tags) {
      try {
        const result = await this.tagModel.findOneAndUpdate(
          { name },
          { $inc: { count: 1 } },
          { upsert: true, new: true },
        );
        tags.push({ name, count: result.count });
        this.logger.log(`Tag incremented or created: ${name}`);
      } catch (error) {
        this.logger.error(error);
      }
    }
    return tags;
  }

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

  async updateItemTagCounts(item: Item) {
    for (const tag of item.tags) {
      try {
        const res = await this.itemModel.updateMany(
          { 'tags.name': tag.name, slug: { $ne: item.slug } },
          { $inc: { 'tags.$.count': 1 } },
        );
        this.logger.log(`Items updated: ${getStringified(res)}`);
        this.logger.log(
          `Item count incremented for tags in items, tag: ${tag.name}`,
        );
      } catch (error) {
        this.logger.error(error);
      }
    }
  }

  async createItemsByTagsOrInsertItem(item: Item) {
    for (const tag of item.tags) {
      if (tag.count === 1) {
        try {
          const itemsByTag = new this.itemsByTagModel({
            tagName: tag.name,
            items: [item],
          });
          await itemsByTag.save();
          this.logger.log(`ItemsByTag created for tag: ${itemsByTag.tagName}`);
        } catch (error) {
          this.logger.error(error);
        }
      } else {
        try {
          await this.itemsByTagModel.updateOne(
            { tagName: tag.name },
            { $push: { items: item } },
          );
        } catch (error) {
          this.logger.error(error);
        }
      }
    }
  }

  async updateItemsByTagCounts(item: Item) {
    for (const tag of item.tags) {
      try {
        await this.itemsByTagModel.updateMany(
          { tagName: tag.name },
          { $inc: { 'items.$[item].tags.$[tag].count': 1 } },
          {
            arrayFilters: [
              { 'item.slug': { $ne: item.slug } },
              { 'tag.name': tag.name },
            ],
          },
        );
      } catch (error) {
        this.logger.error(error);
      }
    }
  }
}
