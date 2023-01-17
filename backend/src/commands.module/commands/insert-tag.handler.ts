import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { EventStore } from '../../eventstore/eventstore';
import { Tag } from '../../models/tag.model';
import { getStringified } from '../../shared/get-stringified';
import { TagInsertedEvent } from '../events/tag-inserted.event';
import { InsertTagCommand } from './insert-tag.command';

@CommandHandler(InsertTagCommand)
export class InsertTagHandler implements ICommandHandler<InsertTagCommand> {
  private readonly logger = new Logger(InsertTagHandler.name);
  constructor(
    private readonly publisher: EventPublisher,
    private readonly eventStore: EventStore,
  ) {}

  async execute({ tag }: InsertTagCommand) {
    this.logger.debug(`${InsertTagCommand.name}: ${getStringified(tag)}`);
    try {
      const newTag = new Tag(tag);
      this.logger.debug(`newTag: ${getStringified(newTag)}`);
      // TODO: Check if Tag can be created
      // TODO: Possibly fix the insertedItem.tags array if one can't be created

      const eventTag = this.publisher.mergeObjectContext(newTag);
      this.eventStore.addEvent(TagInsertedEvent.name, eventTag);
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException('Tag could not be inserted');
    }
  }
}
