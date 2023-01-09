import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { Item } from '../../models/item.model';
import { GetItemListQuery } from './get-item-list.query';

@QueryHandler(GetItemListQuery)
export class GetItemListHandler implements IQueryHandler<GetItemListQuery> {
  private readonly logger = new Logger(GetItemListHandler.name);

  constructor(
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
  ) {}

  async execute({ dto }: GetItemListQuery) {
    const result = await this.itemModel
      // .aggregate([
      //   { $match: { $text: { $search: 'string' } } },
      //   { $sort: { score: { $meta: 'textScore' } } },
      // ]);
      .find(
        { $text: { $search: 'string' } },
        { score: { $meta: 'textScore' } },
        { $sort: { ['boosted']: 'DESC', ['score']: { $meta: 'textScore' } } },
      )
      .limit(10)
      .populate({ path: 'weight' })
      .exec();

    this.logger.debug('result: ', JSON.stringify(result, null, 2));
    return result;
  }
}
