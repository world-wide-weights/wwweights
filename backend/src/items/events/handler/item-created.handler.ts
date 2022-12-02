import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../../models/item.model';
import { ItemCreatedEvent } from '../impl/item-created.event';

@EventsHandler(ItemCreatedEvent)
export class ItemCreatedHandler implements IEventHandler<ItemCreatedEvent> {
  constructor(
    @InjectRepository(Item)
    private readonly repository: Repository<Item>,
  ) {}
  async handle(event: ItemCreatedEvent) {
    await this.repository.save(event.item);
    // TODO: Here will be followup logic like publishing with SSE
  }
}
