import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { getFilter } from '../../shared/get-filter';
import { getSort } from '../../shared/get-sort';
import { DataWithCount } from '../interfaces/counted-items';
import { ItemSortEnum } from '../interfaces/item-sort-enum';
import { Item } from '../models/item.model';
import { ItemRelatedQuery } from './related-items.query';

@QueryHandler(ItemRelatedQuery)
export class ItemRelatedHandler implements IQueryHandler<ItemRelatedQuery> {
  private readonly logger = new Logger(ItemRelatedHandler.name);

  constructor(
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
  ) {}

  async execute({ dto }: ItemRelatedQuery) {
    let item: Item;
    try {
      // KISS, 2 requests instead of a lookup
      item = await this.itemModel
        .findOne<Item>({ slug: dto.slug })
        .select('name tags.name')
        .lean()
        .exec();
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException(
        'Searching for this slug caused an error',
      );
    }

    if (!item) {
      this.logger.error('Item not found');
      throw new UnprocessableEntityException('Item not found');
    }

    try {
      const itemTagNames = item.tags.map((tag) => tag.name);
      const filter = getFilter(item.name + ' ' + itemTagNames.join(' '));
      const sort = getSort(ItemSortEnum.RELEVANCE, true);

      const relatedItemsWithCount = await this.itemModel.aggregate<
        DataWithCount<Item>
      >([
        {
          $match: {
            $and: [filter, { slug: { $ne: dto.slug } }],
          },
        },
        // TODO: Find a fix for @ts-ignore
        // Unfortunately, we need to ignore the following line, because the fields are not known at compile time
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        { $sort: sort },
        {
          $facet: {
            data: [
              { $skip: (dto.page - 1) * dto.limit },
              { $limit: dto.limit },
            ],
            total: [{ $count: 'count' }],
          },
        },
      ]);

      this.logger.log(
        `Related Items found: ${relatedItemsWithCount[0].total[0]?.count || 0}`,
      );

      return {
        total: relatedItemsWithCount[0].total[0]?.count || 0,
        page: dto.page,
        limit: dto.limit,
        data: relatedItemsWithCount[0].data,
      };
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException(
        'Related Items could not be retrieved',
      );
    }
  }
}
