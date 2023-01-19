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

    // Increment/Upsert Tags
    const tags = [];
    if (item.tags) {
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
    }

    // Insert Item
    item.tags = tags; // Here because we use the item later and need the tags there too
    const insertedItem = new this.itemModel(item);
    try {
      await insertedItem.save();
      this.logger.log(`Item inserted:  ${insertedItem.slug}`);
    } catch (error) {
      this.logger.error(error);
    }

    // No need for any tag related projection if item has no tags
    if (!tags) return;

    // Update Items tag counts
    for (const tag of tags) {
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

    // Create ItemsByTags for new Tags and insert Item into existing ItemsByTags
    for (const tag of tags) {
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

    // Update ItemsByTags counts
    for (const tag of tags) {
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
