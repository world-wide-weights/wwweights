import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { EventStore } from '../../EventstoreModule/eventstore';
import { TestItemSagaCommand } from './test-item-saga.command';

@CommandHandler(TestItemSagaCommand)
export class TestItemSagaHandler
  implements ICommandHandler<TestItemSagaCommand>
{
  private readonly logger = new Logger(TestItemSagaHandler.name);
  constructor(
    private readonly publisher: EventPublisher,
    private readonly eventStore: EventStore,
  ) {}

  // No returns, just Exceptions, rest is handled by eventHandler in CQRS
  async execute(command: TestItemSagaCommand) {
    try {
      const eventItem = this.publisher.mergeObjectContext(command.item);

      const eventId = this.eventStore.addEvent(
        'TestItemSagaCommand',
        eventItem,
      );
      this.logger.log(`EventId created: ${eventId}`);
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException('Commands could not be handled');
    }
  }
}
