import { InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@m8a/nestjs-typegoose';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ItemEditSuggestedEvent } from './item-edit-suggested.event';
import { EditSuggestion, SuggestionItem, SuggestionTag } from '../../models/edit-suggestion.model';
import { Item } from '../../models/item.model';
import { ItemsByTag } from '../../models/items-by-tag.model';
import { Tag } from '../../models/tag.model';
import { ReturnModelType } from '@typegoose/typegoose';

@EventsHandler(ItemEditSuggestedEvent)
export class ItemEditSuggestedHandler
  implements IEventHandler<ItemEditSuggestedEvent>
{
  private readonly logger = new Logger(ItemEditSuggestedHandler.name);
  constructor(
    @InjectModel(EditSuggestion)
    private readonly suggestionModel: ReturnModelType<typeof EditSuggestion>,
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
    @InjectModel(Tag)
    private readonly tagModel: ReturnModelType<typeof Tag>,
    @InjectModel(ItemsByTag)
    private readonly itemsByTagModel: ReturnModelType<typeof ItemsByTag>,
  ) {}
  async handle({ editSuggestion }: ItemEditSuggestedEvent) {
    // Performance
    const insertSuggestionStartTime = performance.now();
    await this.insertSuggestion(editSuggestion);

    this.logger.debug(
      `${ItemEditSuggestedHandler.name} Insert took: ${
        performance.now() - insertSuggestionStartTime
      }ms`,
    );

    // Extract tags from item if they exist
    let tags;
    if (editSuggestion.updatedItemValues.tags) {
      // Spread to copy by value, not as reference
      tags = { ...editSuggestion.updatedItemValues.tags };
      // Remove tags from initial => Values are not updated when updating item
      delete editSuggestion.updatedItemValues.tags;
    }
    const updateItemStartTime = performance.now();

    await this.updateItemWithoutTags(
      editSuggestion.itemSlug,
      editSuggestion.updatedItemValues,
    );

    this.logger.debug(
      `${ItemEditSuggestedHandler.name} Item update (no tags) took: ${
        performance.now() - updateItemStartTime
      }ms`,
    );
    // No tags in suggestion => we are done here
    if (!tags) {
      this.logger.debug(
        `Total duration of ${ItemEditSuggestedHandler.name} was ${
          performance.now() - insertSuggestionStartTime
        } ms`,
      );
      return;
    }

    const updateTagsStartTime = performance.now();
    await this.updateTags(tags);
    this.logger.debug(
      `Updating tags by themselves took ${
        performance.now() - updateTagsStartTime
      } ms`,
    );

    const updateItemTagsStartTime = performance.now();
    await this.updateItemTags(editSuggestion.itemSlug, tags);
    this.logger.debug(
      `Updating tags for item took ${
        performance.now() - updateItemTagsStartTime
      } ms`,
    );

    const updateItemsByTagStartTime = performance.now();
    await this.positiveUpdateItemsByTags(editSuggestion.itemSlug, tags.add);
    await this.negativeUpdateItemsByTags(editSuggestion.itemSlug, tags.remove);

    this.logger.debug(
      `Updating ItemsByTag took ${
        performance.now() - updateItemsByTagStartTime
      } ms`,
    );

    this.logger.debug(
      `Total duration of ${ItemEditSuggestedHandler.name} was ${
        performance.now() - insertSuggestionStartTime
      } ms`,
    );
  }

  // Db calls: 1 save()
  async insertSuggestion(suggestion: EditSuggestion) {
    try {
      const insertedSuggestion = new this.suggestionModel(suggestion);
      await insertedSuggestion.save();
      this.logger.log(
        `Edit suggestion inserted for item ${insertedSuggestion.itemSlug}`,
      );
    } catch (error) {
      this.logger.error(
        `Insert suggestion for item ${suggestion.itemSlug}: ${error}`,
      );
      throw new InternalServerErrorException("Couldn't insert suggestion");
    }
  }

  // Db calls: 1 update()
  async updateItemWithoutTags(slug: string, itemData: SuggestionItem) {
    try {
      await this.itemModel.updateOne({ slug: slug }, itemData);
    } catch (error) {
      this.logger.error(
        `Could not update item ${slug} due to an error ${error}`,
      );
      throw new InternalServerErrorException('Item could not be updated');
    }
  }

  // Db calls: 1 Bulk write
  async updateTags(tagUpdate: SuggestionTag) {
    const positiveUpdateQuery = tagUpdate.push.map((tagName) => ({
      updateOne: {
        filter: { name: tagName },
        update: { $inc: { count: 1 } },
        upsert: true,
      },
    }));
    const negativeUpdateQuery = tagUpdate.pull.map((tagName) => ({
      updateOne: {
        filter: { name: tagName },
        update: { $inc: { count: -1 } },
        upsert: false,
      },
    }));
    try {
      this.tagModel.bulkWrite(positiveUpdateQuery.concat(negativeUpdateQuery));
    } catch (error) {
      this.logger.error(
        `Could not update Tags ${tagUpdate.push.concat(
          tagUpdate.pull,
        )} due to an error ${error}`,
      );
      throw new InternalServerErrorException('Could not update tags');
    }
  }

  // Db calls: 1 aggregate
  async updateItemTags(itemSlug: string, tags: SuggestionTag) {
    try {
      await this.itemModel.aggregate([
        { $match: { slug: itemSlug } },
        {
          $lookup: {
            from: 'tags',
            let: { itemTags: '$tags' },
            pipeline: [
              {
                $match: {
                  $and: [
                    {
                      $or: [
                        { name: { $in: '$$itemTags' } },
                        { name: { $in: tags.push } },
                      ],
                    },
                    { name: { $nin: tags.pull } },
                  ],
                },
              },
              { $project: { _id: 0, __v: 0 } },
            ],
            as: 'tags',
          },
        },
        { $merge: { into: 'items' } },
      ]);
    } catch (error) {
      this.logger.error(
        `Could not update tags for Item ${itemSlug} due to an error. ${error}`,
      );
      throw new InternalServerErrorException('Could not update tags for Item');
    }
  }

  // DB Calls: 1 Insert, 1 Aggregate
  async positiveUpdateItemsByTags(itemSlug: string, tags: string[]) {
    if (tags.length === 0) {
      this.logger.debug('No positive ItemsByTags update necessary');
    }
    // Insert new Tags
    try {
      const newTags = tags.map(
        (tag) => new this.itemsByTagModel({ tagName: tag }),
      );
      await this.itemsByTagModel.insertMany(newTags, { ordered: false });
      this.logger.log(
        `ItemsByTag created for tags: ${newTags.map((tag) => tag.tagName)}`,
      );
    } catch (error) {
      this.logger.log(`Acceptable Create ItemsByTags BulkWriteError: ${error}`);
      throw new InternalServerErrorException();
    }

    // Update all documents for newly added tags
    try {
      // Add item to pre existing tags
      await this.itemsByTagModel.aggregate([
        { $match: { tagName: { $in: tags } } },
        {
          $lookup: {
            from: 'items',
            pipeline: [
              { $match: { slug: itemSlug } },
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
      this.logger.error(
        `Could not (positively) update ItemsByTags due to an errror ${error}`,
      );
      throw new InternalServerErrorException('Could not ItemsByTags');
    }
  }

  // Db calls: 1 updateMany
  async negativeUpdateItemsByTags(itemSlug: string, tags: string[]) {
    if (tags.length === 0) {
      this.logger.debug('No negative ItemsByTags update necessary');
    }

    // Cleanup removed tag documents
    try {
      await this.itemsByTagModel.updateMany(
        { tagName: { $in: tags } },
        {
          items: { $pull: { slug: itemSlug } },
        },
      );
    } catch (error) {
      this.logger.error(
        `Could not (negatively) update ItemsByTags due to an errror ${error}`,
      );
      throw new InternalServerErrorException('Could not ItemsByTags');
    }
  }
}
