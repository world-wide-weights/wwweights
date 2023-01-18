import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventStore } from '../../eventstore/eventstore';
import { TagDecrementedEvent } from '../events/tag-decremented.event';
import { DecrementTagCommand } from './decrement-tag.command';

@CommandHandler(DecrementTagCommand)
export class DecrementTagHandler
  implements ICommandHandler<DecrementTagCommand>
{
  private readonly logger = new Logger(DecrementTagHandler.name);
  constructor(private readonly eventStore: EventStore) {}

  async execute({ slug }: DecrementTagCommand) {
    try {
      // TODO: Check if Tag can be incremented

      this.eventStore.addEvent(TagDecrementedEvent.name, slug);
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException('Tag could not be inserted');
    }
  }
}
