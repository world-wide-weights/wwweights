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
    try {
      // Insert Item
      const insertedItem = new this.itemModel(item);
      await insertedItem.save();
      this.logger.log(`Item inserted:  ${insertedItem.slug}`);

      // Tags
      const tags = [];
      for (const { name, slug } of item.tags) {
        try {
          const result = await this.tagModel.findOneAndUpdate(
            { name, slug },
            { $inc: { count: 1 } },
            { upsert: true, new: true },
          );
          tags.push({ name, slug, count: result.count });
          this.logger.log(`Tag incremented or created: ${slug}`);
        } catch (error) {
          this.logger.error(error);
        }
      }

      // Update all Items
      const items = [];
      for (const tag of tags) {
        try {
          const res = await this.itemModel.updateMany(
            { 'tags.slug': tag.slug },
            { $set: { 'tags.$.count': tag.count } }, // no increment here to ensure the value is correct, even if at some point an update on the item failed
          );
          this.logger.debug(`Items updated: ${getStringified(res)}`);
          this.logger.log(
            `Item count incremented for tags in items, tag: ${tag.slug}`,
          );
        } catch (error) {}
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
        for (const item of items) {
          try {
            // TODO: THIS AINT WORKING need to find a way to get all updated items
            await this.itemsByTagModel.findOneAndUpdate(
              { tagName: tag.slug, 'items.slug': item.slug },
              { $set: { 'items.$': item } },
            );
          } catch (error) {}
        }
      }
    } catch (error) {
      // TODO: Do we handle Errors here, coz we send nothing to a user back!? SOLUTION: NEW SAGA or just log
      this.logger.error(error);
      //throw new UnprocessableEntityException('Item could not be inserted');
    }
  }
}
