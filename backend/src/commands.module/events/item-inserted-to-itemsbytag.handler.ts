import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { ItemsByTag } from '../../models/items-by-tag.model';
import { ItemInsertedToItemsByTagEvent } from './item-inserted-to-itemsbytag.event';

@EventsHandler(ItemInsertedToItemsByTagEvent)
export class ItemInsertedToItemsByTagHandler
  implements IEventHandler<ItemInsertedToItemsByTagEvent>
{
  private readonly logger = new Logger(ItemInsertedToItemsByTagHandler.name);
  constructor(
    @InjectModel(ItemsByTag)
    private readonly itemsByTagModel: ReturnModelType<typeof ItemsByTag>,
  ) {}
  async handle({ tag, item }: ItemInsertedToItemsByTagEvent) {
    try {
      this.itemsByTagModel.updateOne(
        { slug: tag.slug },
        { $push: { items: item } },
      );

      this.logger.log(`Item added to: ${tag.slug}`);
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException('Tag could not be incremented');
    }
  }
}
