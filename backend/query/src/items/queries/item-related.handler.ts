import { InjectModel } from '@m8a/nestjs-typegoose';
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { Item } from '../../models/item.model';
import { getFilter } from '../../shared/functions/get-filter';
import { getSort } from '../../shared/functions/get-sort';
import { DataWithCount } from '../../shared/interfaces/data-with-count';
import { PaginatedResponse } from '../../shared/interfaces/paginated-result';
import { ItemSortEnum } from '../enums/item-sort-enum';
import { ItemRelatedQuery } from './item-related.query';

@QueryHandler(ItemRelatedQuery)
export class ItemRelatedHandler implements IQueryHandler<ItemRelatedQuery> {
  private readonly logger = new Logger(ItemRelatedHandler.name);

  constructor(
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
  ) {}

  // KISS, 2 requests instead of a lookup
  async execute({ dto }: ItemRelatedQuery): Promise<PaginatedResponse<Item>> {
    let item: Item;
    const itemReletadedQueryStartTime = performance.now();

    try {
      item = await this.itemModel
        .findOne<Item>({ slug: dto.slug })
        .select('name tags.name')
        .lean()
        .exec();
    } catch (error) /* istanbul ignore next */ {
      this.logger.debug(
        `Failed after ${performance.now() - itemReletadedQueryStartTime} ms`,
      );
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Searching for an item by slug caused an error',
      );
    }

    if (!item) {
      this.logger.debug(
        `Nothing found ${performance.now() - itemReletadedQueryStartTime} ms`,
      );
      this.logger.error('Item not found');
      throw new NotFoundException('Item not found');
    }

    const itemTagNames = item.tags.map((tag) => tag.name);
    const filter = getFilter(item.name + ' ' + itemTagNames.join(' '));
    const sort = getSort(ItemSortEnum.RELEVANCE, true);

    try {
      // We match for all items that match the filter, but not the current item
      // We then sort them by relevance and textScore
      // Then we facet for the data and the total count
      const relatedItemsWithCount = await this.itemModel.aggregate<
        DataWithCount<Item>
      >([
        {
          $match: {
            $and: [filter, { slug: { $ne: dto.slug } }],
          },
        },
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
      this.logger.debug(
        `Finished in ${performance.now() - itemReletadedQueryStartTime} ms`,
      );

      return {
        total: relatedItemsWithCount[0].total[0]?.count || 0,
        page: dto.page,
        limit: dto.limit,
        data: relatedItemsWithCount[0].data,
      };
    } catch (error) /* istanbul ignore next */ {
      this.logger.debug(
        `Failed after ${performance.now() - itemReletadedQueryStartTime} ms`,
      );
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Related Items could not be retrieved',
      );
    }
  }
}
