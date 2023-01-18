import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventStore } from '../../eventstore/eventstore';
import { ItemsByTag } from '../../models/items-by-tag.model';
import { Tag } from '../../models/tag.model';
import { TagIncrementedEvent } from '../events/tag-incremented.event';
import { AddItemToItemsByTagCommand } from './add-item-to-itemsbytag.command';

@CommandHandler(AddItemToItemsByTagCommand)
export class AddItemToItemsByTagHandler
  implements ICommandHandler<AddItemToItemsByTagCommand>
{
  private readonly logger = new Logger(AddItemToItemsByTagHandler.name);
  constructor(private readonly eventStore: EventStore) {}

  async execute({ tag, item }: AddItemToItemsByTagCommand) {
    try {
      // TODO: Check if itemsByTag exists
      const itemsByTag = new ItemsByTag({ tag: new Tag(tag), items: [item] });

      this.eventStore.addEvent(TagIncrementedEvent.name, itemsByTag);
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException(
        'Item could not be added to itemsByTag',
      );
    }
  }
}
