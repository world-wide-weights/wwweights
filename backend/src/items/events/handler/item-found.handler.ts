import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ItemFoundEvent } from '../impl/item-found.event';

@EventsHandler(ItemFoundEvent)
export class ItemFoundHandler implements IEventHandler<ItemFoundEvent> {
  handle(event: ItemFoundEvent) {
    console.log('ItemFoundHandler test');
  }
}
