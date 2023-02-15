import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { ALLOWED_EVENT_ENTITIES } from '../../eventstore/enums/allowedEntities.enum';
import { EventStore } from '../../eventstore/eventstore';
import { DeleteSuggestion } from '../../models/delete-suggestion.model';
import { SUGGESTION_STATUS } from '../../shared/enums/suggestion-status.enum';
import { ItemDeleteSuggestedEvent } from '../events/item-delete-suggested.event';
import { SuggestItemDeleteCommand } from './suggest-item-delete.command';

@CommandHandler(SuggestItemDeleteCommand)
export class SuggestItemDeleteHandler
  implements ICommandHandler<SuggestItemDeleteCommand>
{
  private readonly logger = new Logger(SuggestItemDeleteHandler.name);
  constructor(private readonly eventStore: EventStore) {}

  // No returns, just Exceptions in CQRS
  async execute({
    suggestItemDeleteDto,
    itemSlug,
    userId,
  }: SuggestItemDeleteCommand) {
    const newSuggestion = new DeleteSuggestion({
      ...suggestItemDeleteDto,
      userId,
      itemSlug: itemSlug,
      // Approved is default until votes for suggestions are implemented in frontend
      status: SUGGESTION_STATUS.APPROVED,
      // TODO: Relying on the chance of this being a duplicate for an item being 0 is ok, but not great
      uuid: randomUUID(),
    });

    const streamName = `${ALLOWED_EVENT_ENTITIES.DELETE_SUGGESTION}-${newSuggestion.itemSlug}-${newSuggestion.uuid}`;

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
          `${ALLOWED_EVENT_ENTITIES.DELETE_SUGGESTION}-${newSuggestion.itemSlug}-${newSuggestion.uuid}`,
        )
      ) {
        break;
      }
      newSuggestion.uuid = randomUUID();
      iterations++;
    }

    await this.eventStore.addEvent(
      streamName,
      ItemDeleteSuggestedEvent.name,
      newSuggestion,
    );
    this.logger.log(
      `${ItemDeleteSuggestedEvent.name} created on stream: ${streamName}`,
    );
  }
}
