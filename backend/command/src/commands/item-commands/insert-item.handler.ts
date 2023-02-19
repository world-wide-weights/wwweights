import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ItemInsertedEvent } from '../../events/item-events/item-inserted.event';
import { ALLOWED_EVENT_ENTITIES } from '../../eventstore/enums/allowedEntities.enum';
import { EventStore } from '../../eventstore/eventstore';
import { Item } from '../../models/item.model';
import { Tag } from '../../models/tag.model';
import { getSlug } from '../../shared/functions/get-slug';
import { InsertItemCommand } from './insert-item.command';

@CommandHandler(InsertItemCommand)
export class InsertItemHandler implements ICommandHandler<InsertItemCommand> {
  private readonly logger = new Logger(InsertItemHandler.name);
  constructor(private readonly eventStore: EventStore) {}

  // No returns, just Exceptions in CQRS
  async execute({ insertItemDto, userId }: InsertItemCommand): Promise<void> {
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
      this.logger.error(
        `Slug ${newItem.slug} already taken. No event created.`,
      );
      // Throw error because this is facing the client
      throw new ConflictException(
        `Item with this slug ${newItem.slug} already exists`,
      );
    }

    try {
      await this.eventStore.addEvent(
        streamName,
        ItemInsertedEvent.name,
        newItem,
      );
      this.logger.log(
        `${ItemInsertedEvent.name} created on stream: ${streamName}}`,
      );
    } catch (error) {
      this.logger.error(error);
      this.logger.error(
        `Toplevel error caught. Stopping execution and therefore not creating event. See above for more details`,
      );
      throw new InternalServerErrorException();
    }
  }
}
