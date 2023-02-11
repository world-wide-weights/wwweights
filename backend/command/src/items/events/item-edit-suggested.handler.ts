import { InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@m8a/nestjs-typegoose';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ItemEditSuggestedEvent } from './item-edit-suggested.event';
import {
  EditSuggestion,
  SuggestionItem,
  SuggestionTag,
} from '../../models/edit-suggestion.model';
import { Item } from '../../models/item.model';
import { ItemsByTag } from '../../models/items-by-tag.model';
import { Tag } from '../../models/tag.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { AnyBulkWriteOperation, UpdateFilter } from 'mongodb';

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

    const updateItemStartTime = performance.now();

    await this.updateItem(
      editSuggestion.itemSlug,
      editSuggestion.updatedItemValues,
    );

    this.logger.debug(
      `${ItemEditSuggestedHandler.name} Item update took: ${
        performance.now() - updateItemStartTime
      }ms`,
    );

    // No tags in suggestion => we are done here
    if (!editSuggestion.updatedItemValues.tags) {
      this.logger.debug(
        `Total duration of ${ItemEditSuggestedHandler.name} was ${
          performance.now() - insertSuggestionStartTime
        } ms`,
      );
      return;
    }

    const tags = editSuggestion.updatedItemValues.tags;

    const updateTagsStartTime = performance.now();
    await this.updateTags(tags);
    this.logger.debug(
      `Updating tags by themselves took ${
        performance.now() - updateTagsStartTime
      } ms`,
    );

    const updateItemsByTagStartTime = performance.now();

    await this.positiveUpdateItemsByTags(editSuggestion.itemSlug, tags.push);
    await this.negativeUpdateItemsByTags(editSuggestion.itemSlug, tags.pull);

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

  // Db calls: Min: 1 findOneAndUpdate Top: 2 findOneAndUpdate()
  async updateItem(slug: string, itemData: SuggestionItem) {
    const { tags: tagsValues, ...itemValues } = itemData;
    const tagNamesToPull = tagsValues?.pull || [];
    const tagsToPush =
      tagsValues?.push?.map((tag) => ({ name: tag, count: 1 })) || [];


    try {
      await this.itemModel.findOneAndUpdate(
        { slug },
        {
          ...itemValues,
          $pull: { tags: { name: { $in: tagNamesToPull } } },
        },
      );
      if (tagsToPush.length > 0) {
       await this.itemModel.findOneAndUpdate(
          { slug },
          {
            $addToSet: { tags: tagsToPush },
          },
        );
      }
    } catch (error) {
      this.logger.error(
        `Could not update item ${slug} due to an error ${error}`,
      );
      throw new InternalServerErrorException('Item could not be updated');
    }
  }

  // Db calls: 1 bulkwrite()
  async updateTags(tagUpdate: SuggestionTag) {
    const positiveUpdateQuery: AnyBulkWriteOperation<Tag>[] =
      tagUpdate.push.map((tagName) => ({
        updateOne: {
          filter: { name: tagName },
          update: { $inc: { count: 1 } },
          upsert: true,
        },
      }));
    const negativeUpdateQuery: AnyBulkWriteOperation<Tag>[] =
      tagUpdate.pull.map((tagName) => ({
        updateOne: {
          filter: { name: tagName },
          update: { $inc: { count: -1 } },
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

  // DB Calls: 1 Insert, 1 Aggregate
  async positiveUpdateItemsByTags(itemSlug: string, tags: string[]) {
    if (tags?.length === 0) {
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
    if (tags?.length === 0) {
      this.logger.debug('No negative ItemsByTags update necessary');
    }

    // Cleanup removed tag documents
    try {
      await this.itemsByTagModel.updateMany(
        { tagName: { $in: tags } },
        {
          $pull: { items: { slug: itemSlug } },
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
