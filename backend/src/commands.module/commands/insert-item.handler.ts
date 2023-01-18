import {
  ConflictException,
  HttpException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { ALLOWED_EVENT_ENTITIES } from '../../eventstore/enums/allowedEntities.enum';
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

      if (
        await this.eventStore.doesStreamExist(
          `${ALLOWED_EVENT_ENTITIES.ITEM}-${eventItem.slug}`,
        )
      ) {
        throw new ConflictException('Slug already taken');
      }

      await this.eventStore.addEvent(
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${eventItem.slug}`,
        'ItemInsertedEvent',
        eventItem,
      );
      this.logger.log(`Event created on stream: item-${eventItem.slug}`);
    } catch (error) {
      // If thrown error is already a valid HttpException => Throw that one instead
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(error);
      throw new UnprocessableEntityException('Item could not be inserted');
    }
  }
}
