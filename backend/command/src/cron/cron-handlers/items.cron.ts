import { InjectModel } from '@m8a/nestjs-typegoose';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReturnModelType } from '@typegoose/typegoose';
import { Item } from '../../models/item.model';
import { Tag } from '../../models/tag.model';

@Injectable()
export class ItemCronJobHandler {
  private readonly logger = new Logger(ItemCronJobHandler.name);
  constructor(
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
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
   * @description Delete all tags that are not assigned to an item
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async deleteUnusedTags() {
    const deleteTagsStartTime = performance.now();
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

    this.logger.log(
      `Cronjob for deleting Tags finished in ${
        performance.now() - deleteTagsStartTime
      } ms`,
    );
  }
}
