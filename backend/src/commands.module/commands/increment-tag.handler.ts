import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { EventStore } from '../../eventstore/eventstore';
import { Tag } from '../../models/Tag.model';
import { getSlug } from '../../shared/get-slug';
import { TagIncrementedEvent } from '../events/tag-incremented.event';
import { IncrementTagCommand } from './increment-tag.command';

@CommandHandler(IncrementTagCommand)
export class IncrementTagHandler
  implements ICommandHandler<IncrementTagCommand>
{
  private readonly logger = new Logger(IncrementTagHandler.name);
  constructor(
    private readonly publisher: EventPublisher,
    private readonly eventStore: EventStore,
  ) {}

  async execute({ tag }: IncrementTagCommand) {
    try {
      const newTag = new Tag({
        name: tag.name,
        slug: getSlug(tag.name),
      });
      const eventTag = this.publisher.mergeObjectContext(newTag);

      // TODO: Aggregate State from Eventstore or Tries to check for duplicates and stuff

      this.eventStore.addEvent(TagIncrementedEvent.name, eventTag);
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException('Tag could not be inserted');
    }
  }
}
