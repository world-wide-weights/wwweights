import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { Item } from '../../models/item.model';
import { ItemCreatedEvent } from './item-created.event';

@EventsHandler(ItemCreatedEvent)
export class ItemCreatedHandler implements IEventHandler<ItemCreatedEvent> {
  private readonly logger = new Logger(ItemCreatedHandler.name);
  constructor(
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
  ) {}
  async handle(event: ItemCreatedEvent) {
    try {
      // You can't immediately save on the Model: this.itemModel.save(event.item);
      const createdItem = new this.itemModel(event.item);
      this.logger.debug(JSON.stringify(createdItem, null, 2));
      await createdItem.save();
    } catch (error) {
      // TODO: Do we handle Errors here, coz we send nothing to a user back!? SOLUTION: NEW SAGA
      this.logger.error(error);
      //throw new UnprocessableEntityException('Item could not be created');
    }
  }
}
