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
      // PlainToInstance isntead of new Item() to trigger the slug generation
      // TODO: Here we should request information from the EventStore to see if the slug and item can be created
      const newItem = plainToInstance(Item, command.createItemDto);
      const eventItem = this.publisher.mergeObjectContext(newItem);

      const eventId = this.eventStore.addEvent('ItemCreatedEvent', eventItem);
      this.logger.log(`EventId created: ${eventId}`);
      // const eventFromStore = this.eventStore.getEvent(eventId);
      // eventItem.apply(new ItemCreatedEvent(eventFromStore));
      // eventItem.commit();
    } catch (error) {
      // TODO: Do we handle this also by sending a "createItemFailed" event?
      this.logger.error(error);
      throw new UnprocessableEntityException('Item could not be created');
    }
  }
}
