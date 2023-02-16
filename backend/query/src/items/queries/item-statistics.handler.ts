import { InjectModel } from '@m8a/nestjs-typegoose';
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { getFilter } from '../../shared/functions/get-filter';
import { ItemStatistics } from '../interfaces/item-statistics';
import { Item } from '../models/item.model';
import { ItemStatisticsQuery } from './item-statistics.query';

@QueryHandler(ItemStatisticsQuery)
export class ItemStatisticsHandler
  implements IQueryHandler<ItemStatisticsQuery>
{
  private readonly logger = new Logger(ItemStatisticsHandler.name);

  constructor(
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
  ) {}

  async execute({ dto }: ItemStatisticsQuery): Promise<ItemStatistics> {
    try {
      // We currently also run textSearch on tags
      const filter = getFilter(dto.query, dto.tags);
      const statistics = await this.itemModel.aggregate<ItemStatistics>([
        { $match: filter },
        { $sort: { 'weight.value': -1 } },
        {
          $group: {
            _id: null,
            averageWeight: { $avg: '$weight.value' },
            items: { $push: '$$ROOT' }, // We have to push an array and can't just set it
          },
        },
        { $set: { heaviest: { $first: '$items' } } },
        { $set: { lightest: { $last: '$items' } } },
        { $project: { heaviest: 1, lightest: 1, averageWeight: 1 } },
      ]);

      if (!statistics[0]?.averageWeight) {
        this.logger.log('No items found');
        // Just to jump into the catch
        throw new NotFoundException('No items found');
      }
      return statistics[0];
    } catch (error) {
      this.logger.error(error);
      if (error instanceof NotFoundException) throw error;
      /* istanbul ignore next */
      throw new InternalServerErrorException(
        'Item statistics could not be retrieved',
      );
    }
  }
}
