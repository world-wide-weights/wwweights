import {
  ConflictException,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { ALLOWED_EVENT_ENTITIES } from '../../eventstore/enums/allowedEntities.enum';
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
        slug: getSlug(insertItemDto.name, '-'),
        tags: insertItemDto.tags?.map(
          (tag) => new Tag({ name: getSlug(tag, ' ') }),
        ),
        createdAt: Date.now(),
      });

      if (
        await this.eventStore.doesStreamExist(
          `${ALLOWED_EVENT_ENTITIES.ITEM}-${newItem.slug}`,
        )
      ) {
        throw new ConflictException('Slug already taken');
      }

      const eventItem = this.publisher.mergeObjectContext(newItem);
      await this.eventStore.addEvent(
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${eventItem.slug}`,
        ItemInsertedEvent.name,
        eventItem,
      );
      this.logger.log(`Event created on stream: item-${eventItem.slug}`);
    } catch (error) {
      // If thrown error is already a valid HttpException => Throw that one instead
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(error);
      throw new InternalServerErrorException('Item could not be inserted');
    }
  }
}
