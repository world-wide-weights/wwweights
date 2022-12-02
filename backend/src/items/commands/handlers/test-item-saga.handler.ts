import { UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { ItemTestEvent } from '../../events/impl/item-test.event';
import { TestItemSagaCommand } from '../impl/test-item-saga.command';

@CommandHandler(TestItemSagaCommand)
export class TestItemSagaHandler
  implements ICommandHandler<TestItemSagaCommand>
{
  constructor(private readonly publisher: EventPublisher) {}

  // No returns, just Exceptions, rest is handled by eventHandler in CQRS
  async execute(command: TestItemSagaCommand) {
    try {
      const eventItem = this.publisher.mergeObjectContext(command.item);
      eventItem.apply(new ItemTestEvent(eventItem));
      eventItem.commit();
    } catch (error) {
      console.error(error);
      throw new UnprocessableEntityException('Item could not be created');
    }
  }
}
