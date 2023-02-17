import {
  ConflictException,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ALLOWED_EVENT_ENTITIES } from '../../eventstore/enums/allowedEntities.enum';
import { EventStore } from '../../eventstore/eventstore';
import { Item } from '../../models/item.model';
import { Tag } from '../../models/tag.model';
import { getSlug } from '../../shared/functions/get-slug';
import { ItemInsertedEvent } from '../events/item-inserted.event';
import { InsertItemCommand } from './insert-item.command';

@CommandHandler(InsertItemCommand)
export class InsertItemHandler implements ICommandHandler<InsertItemCommand> {
  private readonly logger = new Logger(InsertItemHandler.name);
  constructor(private readonly eventStore: EventStore) {}

  // No returns, just Exceptions in CQRS
  async execute({ insertItemDto, userId }: InsertItemCommand) {
    try {
      const newItem = new Item({
        ...insertItemDto,
        userId: userId,
        slug: getSlug(insertItemDto.name),
        tags: insertItemDto.tags?.map(
          (tag) => new Tag({ name: getSlug(tag, ' ') }),
        ),
        createdAt: Date.now(),
      });

      const streamName = `${ALLOWED_EVENT_ENTITIES.ITEM}-${newItem.slug}`;

      if (await this.eventStore.doesStreamExist(streamName)) {
        throw new ConflictException('Slug already taken');
      }

      await this.eventStore.addEvent(
        streamName,
        ItemInsertedEvent.name,
        newItem,
      );
      this.logger.log(`Event created on stream: item-${newItem.slug}`);
    } catch (error) {
      // If thrown error is already a valid HttpException => Throw that one instead
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Item could not be inserted (target stream name: ${
          ALLOWED_EVENT_ENTITIES.ITEM
        }-${getSlug(insertItemDto.name)})`,
      );
    }
  }
}
