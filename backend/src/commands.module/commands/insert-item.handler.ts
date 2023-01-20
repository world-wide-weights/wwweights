import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { EventStore } from '../../eventstore/eventstore';
import { Item } from '../../models/item.model';
import { Tag } from '../../models/tag.model';
import { getSlug } from '../../shared/get-slug';
import { ItemInsertedEvent } from '../events/item-inserted.event';
import { InsertItemCommand } from './insert-item.command';

@CommandHandler(InsertItemCommand)
export class InsertItemHandler implements ICommandHandler<InsertItemCommand> {
  private readonly logger = new Logger(InsertItemHandler.name);
  constructor(
    private readonly publisher: EventPublisher,
    private readonly eventStore: EventStore,
  ) {}

  // No returns, just Exceptions in CQRS
  async execute({ insertItemDto }: InsertItemCommand) {
    try {
      const newItem = new Item({
        ...insertItemDto,
        slug: getSlug(insertItemDto.name),
        tags: insertItemDto.tags?.map((tag) => new Tag({ name: getSlug(tag) })),
      });

      // TODO: Check if Item can be inserted with EventstoreDB Streams?
      const eventItem = this.publisher.mergeObjectContext(newItem);
      this.eventStore.addEvent(ItemInsertedEvent.name, eventItem);
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException('Item could not be inserted');
    }
  }
}
