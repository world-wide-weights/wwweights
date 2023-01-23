import { InjectModel } from '@m8a/nestjs-typegoose';
import { Injectable, Logger } from '@nestjs/common';
import { Item } from '../../models/item.model';
import { ItemsByTag } from '../../models/items-by-tag.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ItemCronJobHandler {
  private readonly logger = new Logger(ItemCronJobHandler.name);
  constructor(
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
    @InjectModel(ItemsByTag)
    private readonly itemsByTagModel: ReturnModelType<typeof ItemsByTag>,
  ) {}

  /**
   * @description  Looksup all the tags the item has from the tagModel and updates its array
   */
  @Cron(CronExpression.EVERY_HOUR)
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

  /**
   * @description Lookup all the items the itemsByTags has from the itemModel and updates its array
   */
  @Cron(CronExpression.EVERY_HOUR)
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
