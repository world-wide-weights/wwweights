import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ItemCreatedEvent } from '../impl/item-created.event';

@EventsHandler(ItemCreatedEvent)
export class ItemCreatedHandler implements IEventHandler<ItemCreatedEvent> {
  handle(event: ItemCreatedEvent) {
    console.log('ItemCreatedHandler test', event);
  }
}
