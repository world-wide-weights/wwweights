import { InjectModel } from '@m8a/nestjs-typegoose';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { Item } from '../../models/item.model';
import { getFilter } from '../../shared/functions/get-filter';
import { getSort } from '../../shared/functions/get-sort';
import { DataWithCount } from '../../shared/interfaces/data-with-count.interface';
import { PaginatedResponse } from '../../shared/interfaces/paginated-result.interface';
import { ItemListQuery } from './item-list.query';

@QueryHandler(ItemListQuery)
export class ItemListHandler implements IQueryHandler<ItemListQuery> {
  private readonly logger = new Logger(ItemListHandler.name);

  constructor(
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
  ) {}

  async execute({ dto }: ItemListQuery): Promise<PaginatedResponse<Item>> {
    // We also run textSearch on tags
    const sort = getSort(dto.sort, (dto.query || dto.tags) && !dto.slug);
    const filter = getFilter(
      dto.query,
      dto.tags,
      dto.slug,
      dto.hasimage,
      dto.userId,
    );

    const itemListQueryStartTime = performance.now();

    try {
      // We match for the filter, sort the result and use facet to get the total count and the paginated data
      const itemListWithCount = await this.itemModel.aggregate<
        DataWithCount<Item>
      >([
        { $match: filter },
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
        `Items found: ${itemListWithCount[0].total[0]?.count || 0}`,
      );
      this.logger.debug(
        `Finished in ${performance.now() - itemListQueryStartTime} ms`,
      );

      return {
        total: itemListWithCount[0].total[0]?.count || 0,
        page: dto.page,
        limit: dto.limit,
        data: itemListWithCount[0].data,
      };
    } catch (error) /* istanbul ignore next */ {
      this.logger.debug(
        `Failed after ${performance.now() - itemListQueryStartTime} ms`,
      );
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Item list could not be retrieved',
      );
    }
  }
}
