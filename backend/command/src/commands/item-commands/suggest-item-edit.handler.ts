import { BadRequest } from '@eventstore/db-client/generated/shared_pb';
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { ItemEditSuggestedEvent } from '../../events/item-events/item-edit-suggested.event';
import { ALLOWED_EVENT_ENTITIES } from '../../eventstore/enums/allowedEntities.enum';
import { EventStore } from '../../eventstore/eventstore';
import { EditSuggestion } from '../../models/edit-suggestion.model';
import { SUGGESTION_STATUS } from '../../shared/enums/suggestion-status.enum';
import { SuggestItemEditCommand } from './suggest-item-edit.command';

@CommandHandler(SuggestItemEditCommand)
export class SuggestItemEditHandler
  implements ICommandHandler<SuggestItemEditCommand>
{
  private readonly logger = new Logger(SuggestItemEditHandler.name);
  constructor(private readonly eventStore: EventStore) {}

  // No returns, just Exceptions in CQRS
  async execute({
    suggestItemEditDto,
    itemSlug,
    userId,
  }: SuggestItemEditCommand): Promise<void> {

    // Basic validation that is not possible in DTO due to partial nature of object
    if (
      suggestItemEditDto.weight?.value >=
      suggestItemEditDto.weight?.additionalValue
    ) {
      throw new BadRequestException(
        'Additional Value has to be greater than value',
      );
    }

    const newSuggestion = new EditSuggestion({
      userId,
      itemSlug,
      updatedItemValues: suggestItemEditDto,
      // Approved is default until votes for suggestions are implemented in frontend
      status: SUGGESTION_STATUS.APPROVED,
      uuid: randomUUID(),
    });
    if (
      !(await this.eventStore.doesStreamExist(
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${newSuggestion.itemSlug}`,
      ))
    ) {
      this.logger.error(
        `No item with this slug ${itemSlug} exists. No Event created`,
      );
      // Throw error because this is facing the client
      throw new NotFoundException(`No item with this slug ${itemSlug} exists`);
    }

    const streamName = `${ALLOWED_EVENT_ENTITIES.EDIT_SUGGESTION}-${newSuggestion.itemSlug}-${newSuggestion.uuid}`;

    try {
      await this.eventStore.addEvent(
        streamName,
        ItemEditSuggestedEvent.name,
        newSuggestion,
      );
      this.logger.log(
        `${ItemEditSuggestedEvent.name} created on stream: ${streamName}`,
      );
    } catch (error) /* istanbul ignore next */ {
      this.logger.error(error);
      this.logger.error(
        `Toplevel error caught. Stopping execution and therefore not creating event. See above for more details`,
      );
      throw new InternalServerErrorException('Could not suggest item edit');
    }
  }
}
