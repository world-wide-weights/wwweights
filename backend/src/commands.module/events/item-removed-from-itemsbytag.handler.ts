import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { ItemsByTag } from '../../models/items-by-tag.model';
import { ItemRemovedFromItemsByTagEvent } from './item-removed-from-itemsbytag.event';

@EventsHandler(ItemRemovedFromItemsByTagEvent)
export class ItemRemovedFromItemsByTagHandler
  implements IEventHandler<ItemRemovedFromItemsByTagEvent>
{
  private readonly logger = new Logger(ItemRemovedFromItemsByTagHandler.name);
  constructor(
    @InjectModel(ItemsByTag)
    private readonly itemsByTagModel: ReturnModelType<typeof ItemsByTag>,
  ) {}
  async handle({ tag, item }: ItemRemovedFromItemsByTagEvent) {
    try {
      this.itemsByTagModel.updateOne(
        { slug: tag.slug },
        { $pull: { items: item } },
      );

      this.logger.log(`Item added to: ${tag.slug}`);
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException('Tag could not be incremented');
    }
  }
}
