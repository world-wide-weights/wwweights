import { InjectModel } from '@m8a/nestjs-typegoose';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { DataWithCount } from '../../shared/data-with-count';
import { getFilter } from '../../shared/get-filter';
import { getSort } from '../../shared/get-sort';
import { PaginatedResult } from '../../shared/paginated-result';
import { Item } from '../models/item.model';
import { ItemListQuery } from './item-list.query';

@QueryHandler(ItemListQuery)
export class ItemListHandler implements IQueryHandler<ItemListQuery> {
  private readonly logger = new Logger(ItemListHandler.name);

  constructor(
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
  ) {}

  async execute({ dto }: ItemListQuery): Promise<PaginatedResult<Item>> {
    try {
      // We currently also run textSearch on tags, optimizing via itemsByTags is a TODO
      const sort = getSort(dto.sort, (dto.query || dto.tags) && !dto.slug);
      const filter = getFilter(dto.query, dto.tags, dto.slug);

      // TODO: Query through itemsByTags if tags are listed
      const itemListWithCount = await this.itemModel.aggregate<
        DataWithCount<Item>
      >([
        { $match: filter },
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
        `Items found: ${itemListWithCount[0].total[0]?.count || 0}`,
      );

      return {
        total: itemListWithCount[0].total[0]?.count || 0,
        page: dto.page,
        limit: dto.limit,
        data: itemListWithCount[0].data,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Item list could not be retrieved',
      );
    }
  }
}
