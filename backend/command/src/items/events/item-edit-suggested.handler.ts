import { InjectModel } from '@m8a/nestjs-typegoose';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { AnyBulkWriteOperation } from 'mongodb';
import {
  EditSuggestion,
  SuggestionItem,
  SuggestionTag,
} from '../../models/edit-suggestion.model';
import { Item } from '../../models/item.model';
import { Tag } from '../../models/tag.model';
import { ItemEditSuggestedEvent } from './item-edit-suggested.event';

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

  // Db calls: Min: 1 findOneAndUpdate Max: 2 findOneAndUpdate()
  async updateItem(slug: string, itemData: SuggestionItem) {
    const { tags: tagsValues, weight, ...itemValues } = itemData;
    const tagNamesToPull = tagsValues?.pull || [];
    const tagsToPush =
      tagsValues?.push?.map((tag) => ({ name: tag, count: 1 })) || [];
    const weightSet = {};
    if (weight !== undefined) {
      // Generate object for nested update
      // Format as described in: https://www.mongodb.com/docs/manual/reference/operator/update/set/#set-fields-in-embedded-documents
      Object.keys(weight).forEach((key) => {
        weightSet[`weight.${key}`] = weight[key];
      });
    }

    try {
      await this.itemModel.findOneAndUpdate(
        { slug },
        {
          ...itemValues,
          $pull: { tags: { name: { $in: tagNamesToPull } } },
          $set: weightSet,
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
      console.log(error);
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
}
