import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ALLOWED_EVENT_ENTITIES } from '../../eventstore/enums/allowedEntities.enum';
import { EventStore } from '../../eventstore/eventstore';
import { ItemDeleteSuggestedEvent } from '../events/item-delete-suggested.event';
import { ItemDeletedEvent } from '../events/item-deleted.event';
import { DeleteItemCommand } from './delete-item.command';

@CommandHandler(DeleteItemCommand)
export class DeleteItemHandler implements ICommandHandler<DeleteItemCommand> {
  private readonly logger = new Logger(DeleteItemHandler.name);
  constructor(private readonly eventStore: EventStore) {}

  // No returns, just Exceptions in CQRS
  async execute(deleteItemData: DeleteItemCommand) {
    console.log('Handling item delete');
    const newSuggestion = deleteItemData;

    const streamName = `${ALLOWED_EVENT_ENTITIES.ITEM}-${newSuggestion.itemSlug}`;

    if (!(await this.eventStore.doesStreamExist(streamName))) {
      throw new NotFoundException('No item with this slug exists');
    }

    await this.eventStore.addEvent(
      streamName,
      ItemDeletedEvent.name,
      newSuggestion,
    );
    this.logger.log(
      `${ItemDeleteSuggestedEvent.name} created on stream: ${streamName}`,
    );
  }
}
