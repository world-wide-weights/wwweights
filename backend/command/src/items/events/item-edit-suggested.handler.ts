import { InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@m8a/nestjs-typegoose';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EditSuggestion } from 'src/models/suggestion.model';
import { ItemEditSuggestedEvent } from './item-edit-suggested.event';
import { ReturnModelType } from '@typegoose/typegoose';

@EventsHandler(ItemEditSuggestedEvent)
export class ItemEditSuggestedHandler
  implements IEventHandler<ItemEditSuggestedEvent>
{
  private readonly logger = new Logger(ItemEditSuggestedHandler.name);
  constructor(
    @InjectModel(EditSuggestion)
    private readonly suggestionModel: ReturnModelType<typeof EditSuggestion>,
  ) {}
  async handle({ editSuggestion }: ItemEditSuggestedEvent) {
    // Performance
    const insertSuggestionStartTime = performance.now();
    this.insertSuggestion(editSuggestion);

    this.logger.debug(
      `${ItemEditSuggestedHandler.name} Insert took: ${
        performance.now() - insertSuggestionStartTime
      }ms`,
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
}
