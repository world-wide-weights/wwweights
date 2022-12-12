import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { EventStore } from '../../eventstore/eventstore';
import { Item } from '../../models/item.model';
import { CreateItemCommand } from './create-item.command';

@CommandHandler(CreateItemCommand)
export class CreateItemHandler implements ICommandHandler<CreateItemCommand> {
  private readonly logger = new Logger(CreateItemHandler.name);
  constructor(
    private readonly publisher: EventPublisher,
    private readonly eventStore: EventStore,
  ) {}

  // No returns, just Exceptions, rest is handled by eventHandler in CQRS
  async execute(command: CreateItemCommand) {
    try {
      // Check for normal issues
      this.logger.warn('dto: ', command.createItemDto);
      const newItem = plainToInstance(Item, command.createItemDto);
      this.logger.warn('newItem', newItem);
      const eventItem = this.publisher.mergeObjectContext(newItem);

      // TODO: Aggregate State from Eventstore or Tries to check for duplicates and stuff

      const eventId = this.eventStore.addEvent('ItemCreatedEvent', eventItem);
      this.logger.log(`EventId created: ${eventId}`);
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException('Item could not be created');
    }
  }
}
