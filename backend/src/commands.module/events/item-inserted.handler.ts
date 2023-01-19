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
    const tags = item.tags;
    for (const [index, { name, slug }] of item.tags?.entries()) {
      this.logger.debug({ index, name, slug });
      try {
        const result = await this.tagModel.findOneAndUpdate(
          { name, slug },
          { $inc: { count: 1 } },
          { upsert: true, new: true },
        );
        tags[index].count = result.count;
        this.logger.log(`Tag incremented or created: ${slug}`);
      } catch (error) {
        this.logger.error(error);
      }
    }

    // Insert Item
    const insertedItem = new this.itemModel({ ...item, tags });
    try {
      await insertedItem.save();
      this.logger.log(`Item inserted:  ${insertedItem.slug}`);
    } catch (error) {
      this.logger.error(error);
    }
    this.logger.debug(`Item inserted: ${getStringified(insertedItem)}`);

    // No need for any tag related projection if item has no tags
    if (!tags) return;

    // Update Items tag counts
    for (const tag of tags) {
      try {
        const res = await this.itemModel.updateMany(
          { 'tags.slug': tag.slug, slug: { $ne: item.slug } },
          { $inc: { 'tags.$.count': 1 } },
        );
        this.logger.log(`Items updated: ${getStringified(res)}`);
        this.logger.log(
          `Item count incremented for tags in items, tag: ${tag.slug}`,
        );
      } catch (error) {
        this.logger.error(error);
      }
    }

    // Create ItemsByTags for new Tags
    for (const tag of tags) {
      if (tag.count === 1) {
        const itemsByTag = new this.itemsByTagModel({
          tagName: tag.slug,
          items: [item],
        });
        await itemsByTag.save();
        this.logger.log(`ItemsByTag created for tag: ${tag.slug}`);
      }
    }

    // Update ItemsByTags
    for (const tag of tags) {
      try {
        await this.itemsByTagModel.updateMany(
          { tagName: tag.slug },
          { $inc: { 'items.$[item].tags.$[tag].count': 1 } },
          {
            arrayFilters: [
              { 'item.slug': { $ne: item.slug }, 'tag.slug': tag.slug },
            ],
          },
        );
      } catch (error) {}
    }
  }
}
