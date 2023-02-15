import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { ALLOWED_EVENT_ENTITIES } from '../../eventstore/enums/allowedEntities.enum';
import { EventStore } from '../../eventstore/eventstore';
import { EditSuggestion } from '../../models/edit-suggestion.model';
import { SUGGESTION_STATUS } from '../../shared/enums/suggestion-status.enum';
import { ItemEditSuggestedEvent } from '../events/item-edit-suggested.event';
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
  }: SuggestItemEditCommand) {
    const newSuggestion = new EditSuggestion({
      userId,
      itemSlug: itemSlug,
      updatedItemValues: suggestItemEditDto,
      // Approved is default until votes for suggestions are implemented in frontend
      status: SUGGESTION_STATUS.APPROVED,
      // TODO: Relying on the chance of this being a duplicate for an item being 0 is ok, but not great
      uuid: randomUUID(),
    });

    if (
      !(await this.eventStore.doesStreamExist(
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${newSuggestion.itemSlug}`,
      ))
    ) {
      throw new NotFoundException('No item with this slug exists');
    }

    let iterations = 0;
    while (true) {
      // This should NEVER occur! However this prevents an infinite loop
      if (iterations === 9) {
        throw new InternalServerErrorException('Something went wrong');
      }
      // If eventslug-uuid combination does not exist => continue
      // This ensures uniqueness
      if (
        !this.eventStore.doesStreamExist(
          `${ALLOWED_EVENT_ENTITIES.EDIT_SUGGESTION}-${newSuggestion.itemSlug}-${newSuggestion.uuid}`,
        )
      ) {
        break;
      }
      newSuggestion.uuid = randomUUID();
      iterations++;
    }

    const streamName = `${ALLOWED_EVENT_ENTITIES.EDIT_SUGGESTION}-${newSuggestion.itemSlug}-${newSuggestion.uuid}`;

    await this.eventStore.addEvent(
      streamName,
      ItemEditSuggestedEvent.name,
      newSuggestion,
    );
    this.logger.log(
      `${ALLOWED_EVENT_ENTITIES.EDIT_SUGGESTION} created on stream: ${streamName}`,
    );
  }
}
