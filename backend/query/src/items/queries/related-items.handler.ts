import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { Item } from '../../models/item.model';
import { getFilter } from '../../shared/get-filter';
import { getSort } from '../../shared/get-sort';
import { SortEnum } from '../interfaces/sortEnum';
import { ItemRelatedQuery } from './related-items.query';

@QueryHandler(ItemRelatedQuery)
export class ItemRelatedHandler implements IQueryHandler<ItemRelatedQuery> {
  private readonly logger = new Logger(ItemRelatedHandler.name);

  constructor(
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
  ) {}

  async execute({ dto }: ItemRelatedQuery) {
    try {
      // KISS, 2 requests instead of a lookup
      const item = await this.itemModel
        .findOne({ slug: dto.slug })
        .select('name tags.name')
        .lean()
        .exec();

      const itemTagNames = item.tags.map((tag) => tag.name);
      const filter = getFilter(item.name + ' ' + itemTagNames.join(' '));
      const sort = getSort(SortEnum.RELEVANCE, true);

      const result = await this.itemModel
        .find(
          { ...filter, slug: { $ne: dto.slug } },
          { score: { $meta: 'textScore' } },
          { sort },
        )
        .skip((dto.page - 1) * dto.limit)
        .limit(dto.limit)
        .lean()
        .exec();

      this.logger.log(`Related Items found:  ${result.length}`);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException(
        'Related Items could not be retrieved',
      );
    }
  }
}
