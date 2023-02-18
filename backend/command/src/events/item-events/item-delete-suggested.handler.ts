import { InjectModel } from '@m8a/nestjs-typegoose';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { DeleteSuggestion } from '../../models/delete-suggestion.model';
import { GlobalStatisticsService } from '../services/global-statistics.service';
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
    private readonly sharedService: GlobalStatisticsService,
  ) {}
  async handle({ deleteSuggestion }: ItemDeleteSuggestedEvent) {
    // Performance
    const insertSuggestionStartTime = performance.now();
    await this.insertSuggestion(deleteSuggestion);

    this.logger.debug(
      `${ItemDeleteSuggestedHandler.name} finished in ${
        performance.now() - insertSuggestionStartTime
      }ms`,
    );

    this.sharedService.incrementGlobalSuggestionCount();
  }

  async insertSuggestion(deleteSuggestion: DeleteSuggestion) {
    try {
      const suggestion = new this.deleteSuggestionModel(deleteSuggestion);
      await suggestion.save();
    } catch (error) {
      this.logger.error(
        `Could not insert deletesuggestion ${deleteSuggestion.uuid} due to an error ${error}`,
      );
      throw new InternalServerErrorException(
        `DeleteSuggestion (${deleteSuggestion.uuid}) could not be addded for item (${deleteSuggestion.itemSlug})`,
      );
    }
  }
}
