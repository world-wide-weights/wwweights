import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ItemEditedEvent } from '../../events/item-events/item-edited.event';
import { ItemEditedEventDTO } from '../../eventstore/dtos/edited-item-event.dto';
import { ALLOWED_EVENT_ENTITIES } from '../../eventstore/enums/allowedEntities.enum';
import { EventStore } from '../../eventstore/eventstore';
import { EditItemCommand } from './edit-item.command';

@CommandHandler(EditItemCommand)
export class EditItemHandler implements ICommandHandler<EditItemCommand> {
  private readonly logger = new Logger(EditItemHandler.name);
  constructor(private readonly eventStore: EventStore) {}

  // No returns, just Exceptions in CQRS
  async execute({
    itemSlug,
    editValues,
    suggestionUuid,
  }: EditItemCommand): Promise<void> {
    const newItemEdit: ItemEditedEventDTO = {
      itemSlug,
      editValues,
      suggestionUuid,
    };
    const streamName = `${ALLOWED_EVENT_ENTITIES.ITEM}-${newItemEdit.itemSlug}`;

    if (!(await this.eventStore.doesStreamExist(streamName))) {
      throw new NotFoundException(
        `No item with this slug (${itemSlug}) exists`,
      );
    }

    await this.eventStore.addEvent(
      streamName,
      ItemEditedEvent.name,
      newItemEdit,
    );
    this.logger.log(`${ItemEditedEvent.name} created on stream: ${streamName}`);
  }
}
