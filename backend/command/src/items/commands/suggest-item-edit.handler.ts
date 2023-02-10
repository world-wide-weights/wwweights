import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundError } from 'rxjs';
import { ALLOWED_EVENT_ENTITIES } from 'src/eventstore/enums/allowedEntities.enum';
import { EventStore } from 'src/eventstore/eventstore';
import { EditSuggestion } from 'src/models/suggestion.model';
import { ItemEditSuggestedEvent } from '../events/item-edit-suggested.event';
import { SuggestItemEditCommand } from './suggest-item-edit.command';

@CommandHandler(SuggestItemEditCommand)
export class SuggestItemEditHandler
  implements ICommandHandler<SuggestItemEditCommand>
{
  private readonly logger = new Logger(SuggestItemEditHandler.name);
  constructor(
    private readonly publisher: EventPublisher,
    private readonly eventStore: EventStore,
  ) {}

  // No returns, just Exceptions in CQRS
  async execute({
    suggestItemEditData,
    itemSlug,
    userId,
  }: SuggestItemEditCommand) {
    const newSuggestion = new EditSuggestion({
      user: userId,
      itemSlug: itemSlug,
      updatedItemValues: suggestItemEditData,
    });

    if (
      await this.eventStore.doesStreamExist(
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${newSuggestion.itemSlug}`,
      )
    ) {
      throw new NotFoundException('No item with this slug exists')
    }
    const eventSuggestion = this.publisher.mergeObjectContext(newSuggestion);
    await this.eventStore.addEvent(
      `${ALLOWED_EVENT_ENTITIES.EDIT_SUGGESTION}-${eventSuggestion.itemSlug}`,
      ItemEditSuggestedEvent.name,
      eventSuggestion,
    );
    this.logger.log(`Event created on stream: ${ALLOWED_EVENT_ENTITIES.EDIT_SUGGESTION}-${eventSuggestion.itemSlug}`);
  }
}
