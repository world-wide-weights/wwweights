import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../../models/item.model';
import { ItemCreatedEvent } from './item-created.event';

@EventsHandler(ItemCreatedEvent)
export class ItemCreatedHandler implements IEventHandler<ItemCreatedEvent> {
  private readonly logger = new Logger(ItemCreatedHandler.name);
  constructor(
    @InjectRepository(Item)
    private readonly repository: Repository<Item>,
  ) {}
  async handle(event: ItemCreatedEvent) {
    try {
      await this.repository.save(event.item);
      // TODO: Here will be followup logic like publishing with SSE
    } catch (error) {
      // TODO: Do we handle Errors here, coz we send nothing to a user back!? SOLUTION: NEW SAGA
      this.logger.error(error);
      //throw new UnprocessableEntityException('Item could not be created');
    }
  }
}
