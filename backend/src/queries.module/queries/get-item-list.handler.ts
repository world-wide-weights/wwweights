import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { Item } from '../../models/item.model';
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
    const sort = getSort(dto.sort);

    // TODO: Query through itemsByTags if tags are listed
    const result = await this.itemModel
      .find(
        { $text: { $search: dto.query || '' } },
        { score: { $meta: 'textScore' } },
        { $sort: sort },
      )
      .skip((dto.page - 1) * dto.limit)
      .limit(dto.limit)
      .exec();

    this.logger.debug('result: ', JSON.stringify(result, null, 2));
    return result;
  }
}
