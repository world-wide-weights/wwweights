import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { Item } from '../../models/item.model';
import { getFilter } from '../../shared/get-filter';
import { getSort } from '../../shared/get-sort';
import { GetItemListQuery } from './get-item-list.query';

@QueryHandler(GetItemListQuery)
export class GetItemListHandler implements IQueryHandler<GetItemListQuery> {
  private readonly logger = new Logger(GetItemListHandler.name);

  constructor(
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
  ) {}

  async execute({ dto }: GetItemListQuery) {
    try {
      if (!dto.query && !dto.tags && !dto.slug)
        throw new UnprocessableEntityException(
          'No search without restrictions',
        );

      const sort = getSort(dto.sort, !!dto.query);
      const filter = getFilter(dto.query, dto.tags, dto.slug);

      // TODO: Query through itemsByTags if tags are listed
      const result = await this.itemModel
        .find(filter, { score: { $meta: 'textScore' } }, { $sort: sort })
        .skip((dto.page - 1) * dto.limit)
        .limit(dto.limit)
        .exec();

      this.logger.log(`Items found:  ${result.length}`);

      return result;
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException(
        'Item list could not be retrieved',
      );
    }
  }
}
