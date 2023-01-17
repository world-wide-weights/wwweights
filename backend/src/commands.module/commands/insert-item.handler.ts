import { Logger, UnprocessableEntityException } from '@nestjs/common';
import {
  CommandBus,
  CommandHandler,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { EventStore } from '../../eventstore/eventstore';
import { Item } from '../../models/item.model';
import { getSlug } from '../../shared/get-slug';
import { ItemInsertedEvent } from '../events/item-inserted.event';
import { IncrementTagCommand } from './increment-tag.command';
import { InsertItemCommand } from './insert-item.command';
import { InsertTagCommand } from './insert-tag.command';

@CommandHandler(InsertItemCommand)
export class InsertItemHandler implements ICommandHandler<InsertItemCommand> {
  private readonly logger = new Logger(InsertItemHandler.name);
  constructor(
    private readonly publisher: EventPublisher,
    private readonly eventStore: EventStore,
    private commandBus: CommandBus,
  ) {}

  // No returns, just Exceptions in CQRS
  async execute({ insertItemDto }: InsertItemCommand) {
    try {
      // Create the slugs for the Tags if missing

      const existingTags = insertItemDto.tags.filter((tag) => tag.slug);
      const newTags = insertItemDto.tags
        .filter((tag) => !tag.slug)
        .map((tag) => ({
          name: tag.name,
          slug: getSlug(tag.name),
          count: 1,
        }));

      this.logger.debug('existingTags: ', existingTags);
      this.logger.debug('newTags: ', newTags);

      const newItem = new Item({
        ...insertItemDto,
        slug: getSlug(insertItemDto.name),
        tags: [...existingTags, ...newTags],
      });

      // TODO: Check if Item can be inserted with EventstoreDB Streams?
      const eventItem = this.publisher.mergeObjectContext(newItem);
      this.eventStore.addEvent(ItemInsertedEvent.name, eventItem);

      // TODO: Do the following 2 loops as a SAGA instead
      for (const tag of existingTags) {
        this.commandBus.execute(new IncrementTagCommand(tag.slug));
      }
      for (const tag of newTags) {
        this.commandBus.execute(new InsertTagCommand(tag));
      }
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException('Item could not be inserted');
    }
  }
}
