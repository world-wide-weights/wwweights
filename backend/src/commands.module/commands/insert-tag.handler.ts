import { Logger, UnprocessableEntityException } from '@nestjs/common';
import {
  CommandBus,
  CommandHandler,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { EventStore } from '../../eventstore/eventstore';
import { Tag } from '../../models/tag.model';
import { TagInsertedEvent } from '../events/tag-inserted.event';
import { InsertItemsByTagCommand } from './insert-itemsbytag.command';
import { InsertTagCommand } from './insert-tag.command';

@CommandHandler(InsertTagCommand)
export class InsertTagHandler implements ICommandHandler<InsertTagCommand> {
  private readonly logger = new Logger(InsertTagHandler.name);
  constructor(
    private readonly publisher: EventPublisher,
    private readonly eventStore: EventStore,
    private commandBus: CommandBus,
  ) {}

  async execute({ tag, item }: InsertTagCommand) {
    try {
      const newTag = new Tag(tag);

      // TODO: Check if Tag can be created
      // TODO: Possibly fix the insertedItem.tags array if one can't be created

      const eventTag = this.publisher.mergeObjectContext(newTag);
      this.eventStore.addEvent(TagInsertedEvent.name, eventTag);

      this.commandBus.execute(new InsertItemsByTagCommand(tag, item));
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException('Tag could not be inserted');
    }
  }
}
