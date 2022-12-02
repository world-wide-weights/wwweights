import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ItemTestEvent } from '../impl/item-test.event';

@EventsHandler(ItemTestEvent)
export class ItemTestHandler implements IEventHandler<ItemTestEvent> {
  handle(event: ItemTestEvent) {
    // TODO: Remove test event and commands once explained to team
    console.log('ItemTestHandler', event);
  }
}
