import { InjectModel } from '@m8a/nestjs-typegoose';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { EditSuggestion } from '../../models/edit-suggestion.model';
import { ImagesService } from '../services/images.service';
import { ItemEditSuggestedEvent } from './item-edit-suggested.event';

@EventsHandler(ItemEditSuggestedEvent)
export class ItemEditSuggestedHandler
  implements IEventHandler<ItemEditSuggestedEvent>
{
  private readonly logger = new Logger(ItemEditSuggestedHandler.name);
  constructor(
    @InjectModel(EditSuggestion)
    private readonly suggestionModel: ReturnModelType<typeof EditSuggestion>,
    private readonly imageService: ImagesService,
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

    if (editSuggestion.updatedItemValues.image) {
      const imgBackendCallStartTime = performance.now();
      // Promote image to permanent once suggestion is done. The image is now relevant for our business logic
      await this.imageService.promoteImageInImageBackend(
        editSuggestion.updatedItemValues.image,
      );

      this.logger.debug(
        `Finished Image backend api call in ${
          performance.now() - imgBackendCallStartTime
        }`,
      );
    }

    this.logger.debug(
      `Total duration of ${ItemEditSuggestedHandler.name} was ${
        performance.now() - insertSuggestionStartTime
      } ms`,
    );
  }

  // Db calls: 1 save()
  async insertSuggestion(editSuggestion: EditSuggestion) {
    try {
      const insertedSuggestion = new this.suggestionModel(editSuggestion);
      await insertedSuggestion.save();
      this.logger.log(
        `Edit suggestion inserted for item ${insertedSuggestion.itemSlug}`,
      );
    } catch (error) {
      this.logger.error(
        `Insert suggestion for item ${editSuggestion.itemSlug}: ${error}`,
      );
      throw new InternalServerErrorException(
        `EditSuggestion (${editSuggestion.uuid}) could not be addded for item (${editSuggestion.itemSlug})`,
      );
    }
  }
}
