import {
  ConflictException,
  HttpException,
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
      throw new ConflictException(`Slug ${newItem.slug} already taken`);
    }

    await this.eventStore.addEvent(streamName, ItemInsertedEvent.name, newItem);
    this.logger.log(
      `${ItemInsertedEvent.name} created on stream: ${streamName}}`,
    );
  }
}
