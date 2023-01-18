import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventStore } from '../../eventstore/eventstore';
import { TagIncrementedEvent } from '../events/tag-incremented.event';
import { AddItemToItemsByTagCommand } from './add-item-to-itemsbytag.command';
import { IncrementTagCommand } from './increment-tag.command';

@CommandHandler(IncrementTagCommand)
export class IncrementTagHandler
  implements ICommandHandler<IncrementTagCommand>
{
  private readonly logger = new Logger(IncrementTagHandler.name);
  constructor(
    private readonly eventStore: EventStore,
    private commandBus: CommandBus,
  ) {}

  async execute({ tag, item }: IncrementTagCommand) {
    try {
      // TODO: Check if Tag can be incremented
      this.eventStore.addEvent(TagIncrementedEvent.name, tag);
      this.commandBus.execute(new AddItemToItemsByTagCommand(tag, item));
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException('Tag could not be inserted');
    }
  }
}
