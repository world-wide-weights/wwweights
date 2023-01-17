import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { Item } from '../../models/item.model';
import { ItemInsertedEvent } from './item-inserted.event';

@EventsHandler(ItemInsertedEvent)
export class ItemInsertedHandler implements IEventHandler<ItemInsertedEvent> {
  private readonly logger = new Logger(ItemInsertedHandler.name);
  constructor(
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
  ) {}
  async handle({ item }: ItemInsertedEvent) {
    try {
      const insertedItem = new this.itemModel(item);
      await insertedItem.save();

      this.logger.log(`Item inserted:  ${insertedItem.slug}`);
      // TODO: Also save alterations itemsByTag
    } catch (error) {
      // TODO: Do we handle Errors here, coz we send nothing to a user back!? SOLUTION: NEW SAGA
      this.logger.error(error);
      //throw new UnprocessableEntityException('Item could not be inserted');
    }
  }
}
