import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { ItemsByTag } from '../../models/items-by-tag.model';
import { ItemsByTagInsertedEvent } from './itemsbytag-inserted.event';

@EventsHandler(ItemsByTagInsertedEvent)
export class ItemsByTagInsertedHandler
  implements IEventHandler<ItemsByTagInsertedEvent>
{
  private readonly logger = new Logger(ItemsByTagInsertedHandler.name);
  constructor(
    @InjectModel(ItemsByTag)
    private readonly itemsByTagModel: ReturnModelType<typeof ItemsByTag>,
  ) {}
  async handle(event: ItemsByTagInsertedEvent) {
    try {
      const insertedItemsByTag = new this.itemsByTagModel(event);
      await insertedItemsByTag.save();

      this.logger.log(`ItemsByTag inserted:  ${event.tag.slug}`);
    } catch (error) {
      // TODO: Do we handle Errors here, coz we send nothing to a user back!? SOLUTION: NEW SAGA
      this.logger.error(error);
      throw new UnprocessableEntityException('Tag could not be inserted');
    }
  }
}
