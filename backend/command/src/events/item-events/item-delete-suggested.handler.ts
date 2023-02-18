import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { DeleteSuggestion } from '../../models/delete-suggestion.model';
import { StatisticsService } from '../services/statistics.service';
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
    private readonly statisticsService: StatisticsService,
  ) {}
  async handle({ deleteSuggestion }: ItemDeleteSuggestedEvent): Promise<void> {
    const insertSuggestionStartTime = performance.now();
    try {
      // Performance
      await this.insertDeleteSuggestion(deleteSuggestion);
      await this.statisticsService.incrementGlobalSuggestionCount();
    } catch (error) {
      this.logger.error(
        `Toplevel error caught. Stopping execution. See above for more details`,
      );
    }
    this.logger.debug(
      `Finished in ${performance.now() - insertSuggestionStartTime} ms`,
    );
  }

  /**
   * @description Insert delete suggestion into Read DB
   */
  private async insertDeleteSuggestion(
    deleteSuggestion: DeleteSuggestion,
  ): Promise<void> {
    try {
      const suggestion = new this.deleteSuggestionModel(deleteSuggestion);
      await suggestion.save();
    } catch (error) {
      this.logger.error(
        `Could not insert deletesuggestion ${deleteSuggestion.uuid} due to an error ${error}`,
      );
      throw new Error(
        `DeleteSuggestion (${deleteSuggestion.uuid}) could not be addded for item (${deleteSuggestion.itemSlug})`,
      );
    }
  }
}
