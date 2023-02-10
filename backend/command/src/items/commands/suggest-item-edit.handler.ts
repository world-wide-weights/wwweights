import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { ALLOWED_EVENT_ENTITIES } from '../../eventstore/enums/allowedEntities.enum';
import { EventStore } from '../../eventstore/eventstore';
import { EditSuggestion } from '../../models/edit-suggestion.model';
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
      `${ALLOWED_EVENT_ENTITIES.EDIT_SUGGESTION}-${eventSuggestion.itemSlug}`,
      ItemEditSuggestedEvent.name,
      eventSuggestion,
    );
    this.logger.log(
      `Event created on stream: ${ALLOWED_EVENT_ENTITIES.EDIT_SUGGESTION}-${eventSuggestion.itemSlug}`,
    );
  }
}
