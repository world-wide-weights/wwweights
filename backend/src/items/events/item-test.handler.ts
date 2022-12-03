import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ItemTestEvent } from './item-test.event';

@EventsHandler(ItemTestEvent)
export class ItemTestHandler implements IEventHandler<ItemTestEvent> {
  private readonly logger = new Logger(ItemTestHandler.name);
  handle(event: ItemTestEvent) {
    // TODO: Remove test event and commands once explained to team
    this.logger.log(event);
  }
}
