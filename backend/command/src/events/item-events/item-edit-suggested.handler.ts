import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { EditSuggestion } from '../../models/edit-suggestion.model';
import { ImagesService } from '../services/images.service';
import { StatisticsService } from '../services/statistics.service';
import { ItemEditSuggestedEvent } from './item-edit-suggested.event';

@EventsHandler(ItemEditSuggestedEvent)
export class ItemEditSuggestedHandler
  implements IEventHandler<ItemEditSuggestedEvent>
{
  private readonly logger = new Logger(ItemEditSuggestedHandler.name);
  constructor(
    @InjectModel(EditSuggestion)
    private readonly suggestionModel: ReturnModelType<typeof EditSuggestion>,
    private readonly statisticsService: StatisticsService,
    private readonly imagesService: ImagesService,
  ) {}
  async handle({ editSuggestion }: ItemEditSuggestedEvent): Promise<void> {
    // Performance
    const insertSuggestionStartTime = performance.now();

    try {
      await this.insertEditSuggestion(editSuggestion);

      this.logger.debug(
        `Insert took: ${performance.now() - insertSuggestionStartTime} ms`,
      );

      if (editSuggestion.updatedItemValues.image) {
        const imgBackendCallStartTime = performance.now();

        // Promote image to permanent once suggestion is done. The image is now relevant for our business logic
        await this.imagesService.promoteImageInImageBackend(
          editSuggestion.updatedItemValues.image,
        );

        this.logger.debug(
          `Finished Image backend api call in ${
            performance.now() - imgBackendCallStartTime
          } ms`,
        );
      }

      await this.statisticsService.incrementGlobalSuggestionCount();
    } catch (error) /* istanbul ignore next */ {
      this.logger.error(error);
      this.logger.error(
        `Toplevel error caught. Stopping execution. See above for more details`,
      );
    }

    this.logger.debug(
      `Finished in ${performance.now() - insertSuggestionStartTime} ms`,
    );
  }

  // Db calls: 1 save()
  private async insertEditSuggestion(
    editSuggestion: EditSuggestion,
  ): Promise<void> {
    try {
      const insertedSuggestion = new this.suggestionModel(editSuggestion);
      await insertedSuggestion.save();
    } catch (error) /* istanbul ignore next */ {
      this.logger.error(
        `Insert suggestion for item ${editSuggestion.itemSlug}: ${error}`,
      );
      throw new Error(
        `EditSuggestion (${editSuggestion.uuid}) could not be addded for item (${editSuggestion.itemSlug})`,
      );
    }
  }
}
