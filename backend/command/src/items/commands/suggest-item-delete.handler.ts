import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { ALLOWED_EVENT_ENTITIES } from '../../eventstore/enums/allowedEntities.enum';
import { EventStore } from '../../eventstore/eventstore';
import { DeleteSuggestion } from '../../models/delete-suggestion.model';
import { ItemDeleteSuggestedEvent } from '../events/item-delete-suggested.event';
import { SuggestItemDeleteCommand } from './suggest-item-delete.command';

@CommandHandler(SuggestItemDeleteCommand)
export class SuggestItemDeleteHandler
  implements ICommandHandler<SuggestItemDeleteCommand>
{
  private readonly logger = new Logger(SuggestItemDeleteHandler.name);
  constructor(
    private readonly publisher: EventPublisher,
    private readonly eventStore: EventStore,
  ) {}

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
    const eventSuggestion = this.publisher.mergeObjectContext(newSuggestion);
    await this.eventStore.addEvent(
      `${ALLOWED_EVENT_ENTITIES.DELETE_SUGGESTION}-${eventSuggestion.itemSlug}`,
      ItemDeleteSuggestedEvent.name,
      eventSuggestion,
    );
    this.logger.log(
      `Event created on stream: ${ALLOWED_EVENT_ENTITIES.EDIT_SUGGESTION}-${eventSuggestion.itemSlug}`,
    );
  }
}
