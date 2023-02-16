import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ItemDeletedEventDTO } from '../../eventstore/dtos/deleted-item-event.dto';
import { ALLOWED_EVENT_ENTITIES } from '../../eventstore/enums/allowedEntities.enum';
import { EventStore } from '../../eventstore/eventstore';
import { ItemDeletedEvent } from '../events/item-deleted.event';
import { DeleteItemCommand } from './delete-item.command';

@CommandHandler(DeleteItemCommand)
export class DeleteItemHandler implements ICommandHandler<DeleteItemCommand> {
  private readonly logger = new Logger(DeleteItemHandler.name);
  constructor(private readonly eventStore: EventStore) {}

  // No returns, just Exceptions in CQRS
  async execute(deleteItemData: DeleteItemCommand) {
    console.log('delete item');
    const newItemDelete: ItemDeletedEventDTO = deleteItemData;

    const streamName = `${ALLOWED_EVENT_ENTITIES.ITEM}-${newItemDelete.itemSlug}`;

    if (!(await this.eventStore.doesStreamExist(streamName))) {
      throw new NotFoundException('No item with this slug exists');
    }

    await this.eventStore.addEvent(
      streamName,
      ItemDeletedEvent.name,
      newItemDelete,
    );
    this.logger.log(
      `${ItemDeletedEvent.name} created on stream: ${streamName}`,
    );
  }
}
