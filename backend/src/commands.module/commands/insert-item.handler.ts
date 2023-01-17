import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { EventStore } from '../../eventstore/eventstore';
import { Item } from '../../models/item.model';
import { getSlug } from '../../shared/get-slug';
import { InsertItemCommand } from './insert-item.command';

@CommandHandler(InsertItemCommand)
export class InsertItemHandler implements ICommandHandler<InsertItemCommand> {
  private readonly logger = new Logger(InsertItemHandler.name);
  constructor(
    private readonly publisher: EventPublisher,
    private readonly eventStore: EventStore,
  ) {}

  // No returns, just Exceptions in CQRS
  async execute(command: InsertItemCommand) {
    try {
      const newItem = new Item({
        ...command.insertItemDto,
        slug: getSlug(command.insertItemDto.name),
      });
      const eventItem = this.publisher.mergeObjectContext(newItem);

      // TODO: Aggregate State from Eventstore or Tries to check for duplicates and stuff

      const eventId = this.eventStore.addEvent('ItemInsertedEvent', eventItem);
      this.logger.log(`EventId created: ${eventId}`);
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException('Item could not be inserted');
    }
  }
}
