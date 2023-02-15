import { InjectModel } from '@m8a/nestjs-typegoose';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { DeleteSuggestion } from '../../models/delete-suggestion.model';
import { Item } from '../../models/item.model';
import { Tag } from '../../models/tag.model';
import { ItemDeleteSuggestedEvent } from './item-delete-suggested.event';

@EventsHandler(ItemDeleteSuggestedEvent)
export class ItemDeleteSuggestedHandler
  implements IEventHandler<ItemDeleteSuggestedEvent>
{
  private readonly logger = new Logger(ItemDeleteSuggestedHandler.name);
  constructor(
    @InjectModel(DeleteSuggestion)
    private readonly deleteSuggestionModel: ReturnModelType<
      typeof DeleteSuggestion
    >,
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
    @InjectModel(Tag)
    private readonly tagModel: ReturnModelType<typeof Tag>,
  ) {}
  async handle({ deleteSuggestion }: ItemDeleteSuggestedEvent) {
    // Performance
    const insertSuggestionStartTime = performance.now();
    await this.insertSuggestion(deleteSuggestion);

    this.logger.debug(
      `${ItemDeleteSuggestedHandler.name} Insert took: ${
        performance.now() - insertSuggestionStartTime
      }ms`,
    );

    const updateItemStartTime = performance.now();

    // Storing item information here is valid as it cant change anymore
    const deletedItem: Item = await this.deleteItem(deleteSuggestion.itemSlug);

    this.logger.debug(
      `${ItemDeleteSuggestedHandler.name} Item delete took: ${
        performance.now() - updateItemStartTime
      }ms`,
    );

    if (!deletedItem?.tags) {
      this.logger.log(
        `${ItemDeleteSuggestedHandler.name} took ${
          performance.now() - insertSuggestionStartTime
        } ms. (No tag update)`,
      );
      return;
    }

    const updateTagsStartTime = performance.now();

    const tagNames = deletedItem.tags.map((tag) => tag.name);

    await this.updateTags(tagNames);

    this.logger.log(
      `${ItemDeleteSuggestedHandler.name} finished in ${
        performance.now() - updateTagsStartTime
      }`,
    );
  }

  async insertSuggestion(deleteSuggestion: DeleteSuggestion) {
    try {
      const suggestion = new this.deleteSuggestionModel(deleteSuggestion);
      await suggestion.save();
    } catch (error) {
      this.logger.error(
        `Could not insert deletesuggestion ${deleteSuggestion.uuid} due to an error ${error}`,
      );
      throw new InternalServerErrorException();
    }
  }

  async deleteItem(slug: string) {
    try {
      const oldItem = await this.itemModel.findOneAndDelete({ slug });
      return oldItem;
    } catch (error) {
      this.logger.error(
        `Could not delete item ${slug} due to an error ${error}`,
      );
      throw new InternalServerErrorException();
    }
  }

  async updateTags(tagNames: string[]) {
    try {
      await this.tagModel.updateMany(
        { name: { $in: tagNames } },
        {
          $inc: { count: -1 },
        },
      );
    } catch (error) {
      this.logger.error(
        `Could not update Tags ${tagNames.join(',')} due to an error ${error}`,
      );
      throw new InternalServerErrorException('Could not update tags');
    }
  }
}
