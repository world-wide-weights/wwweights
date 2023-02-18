import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { ItemDeleteSuggestedEvent } from '../../events/item-events/item-delete-suggested.event';
import { ALLOWED_EVENT_ENTITIES } from '../../eventstore/enums/allowedEntities.enum';
import { EventStore } from '../../eventstore/eventstore';
import { DeleteSuggestion } from '../../models/delete-suggestion.model';
import { SUGGESTION_STATUS } from '../../shared/enums/suggestion-status.enum';
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
      itemSlug,
      // Approved is default until votes for suggestions are implemented in frontend
      status: SUGGESTION_STATUS.APPROVED,
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
