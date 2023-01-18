import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventStore } from '../../eventstore/eventstore';
import { ItemsByTag } from '../../models/items-by-tag.model';
import { Tag } from '../../models/tag.model';
import { ItemsByTagInsertedEvent } from '../events/itemsbytag-inserted.event';
import { InsertItemsByTagCommand } from './insert-itemsbytag.command';

@CommandHandler(InsertItemsByTagCommand)
export class InsertItemsByTagHandler
  implements ICommandHandler<InsertItemsByTagCommand>
{
  private readonly logger = new Logger(InsertItemsByTagHandler.name);
  constructor(private readonly eventStore: EventStore) {}

  async execute({ tag, item }: InsertItemsByTagCommand) {
    try {
      // TODO: Check if itemsByTag exists
      const itemsByTag = new ItemsByTag({ tag: new Tag(tag), items: [item] });

      this.eventStore.addEvent(ItemsByTagInsertedEvent.name, itemsByTag);
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException(
        'Item could not be added to itemsByTag',
      );
    }
  }
}
