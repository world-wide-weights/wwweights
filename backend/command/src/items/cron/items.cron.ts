import { InjectModel } from '@m8a/nestjs-typegoose';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReturnModelType } from '@typegoose/typegoose';
import { Item } from '../../models/item.model';
import { ItemsByTag } from '../../models/items-by-tag.model';
import { Tag } from '../../models/tag.model';

@Injectable()
export class ItemCronJobHandler {
  private readonly logger = new Logger(ItemCronJobHandler.name);
  constructor(
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
    @InjectModel(ItemsByTag)
    private readonly itemsByTagModel: ReturnModelType<typeof ItemsByTag>,
    @InjectModel(Tag)
    private readonly tagModel: ReturnModelType<typeof Tag>,
  ) {}

  /**
   * @description  Looksup all the tags the item has from the tagModel and updates its array
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async correctAllItemTagCounts() {
    // Performance
    const updateTagCountStart = performance.now();
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
      this.logger.log(
        `Cronjob for updating Tag count in Items finished in${
          performance.now() - updateTagCountStart
        } ms (Job failed)`,
      );
      return;
    }
    this.logger.log(
      `Cronjob for Tag count in Items finished in ${
        performance.now() - updateTagCountStart
      } ms (Job succeeded)`,
    );
  }

  /**
   * @description Lookup all the items the itemsByTags has from the itemModel and updates its array
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async correctAllItemsByTagCounts() {
    // Since other items can be inserted in the meantime, causing the count to be off, we can't go for the fastest solution of $inc, but have to actually fetch the data again.
    // This is fine since it is a readDB and doesn't have to be written on fast
    const updateTagCountStart = performance.now();
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
      this.logger.log(
        `Cronjob for updating Tag Counts in ItemsByTag finished in ${
          performance.now() - updateTagCountStart
        } ms (Job failed)`,
      );
      return;
    }
    this.logger.log(
      `Cronjob for updating Tag Counts in ItemsByTag finished in ${
        performance.now() - updateTagCountStart
      } ms (Job succeeded)`,
    );
  }

  /**
   * @description Delete all tags that are not assigned to an item
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async deleteUnusedTags() {
    const deleteTagsStartTime = performance.now();
    // ItemsByTags deletion is handled via mongoose middleware
    try {
      const { deletedCount } = await this.tagModel.deleteMany({
        count: { $lte: 0 },
      });
      // No tags deleted => No need in second cleanup step
      if (deletedCount === 0) {
        this.logger.log(
          `Cronjob for deleting Tags in ${
            performance.now() - deleteTagsStartTime
          } ms (Job succeeded, no action performed)`,
        );
        return;
      }
    } catch (error) {
      this.logger.error(error);
      this.logger.log(
        this.logger.log(
          `Cronjob for deleting Tags in ${
            performance.now() - deleteTagsStartTime
          } ms (Job failed)`,
        ),
      );
      return;
    }

    try {
      // Newly created tags don´t have the items field defined yet
      // => If it exists but is empty the item has been used previously
      await this.itemsByTagModel.deleteMany({
        $and: [{ items: { $exists: true } }, { items: { $size: 0 } }],
      });
    } catch (error) {
      this.logger.error(error);
      this.logger.log(
        `Cronjob for deleting Tags in ${
          performance.now() - deleteTagsStartTime
        } ms (Job failed)`,
      );
      return;
    }
    this.logger.log(
      `Cronjob for deleting Tags finished in ${
        performance.now() - deleteTagsStartTime
      } ms`,
    );
  }
}
