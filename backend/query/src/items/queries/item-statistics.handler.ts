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
import { ItemStatistics } from '../interfaces/item-statistics.interface';
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
    const itemStatisticsQueryStartTime = performance.now();
    // We also run textSearch on tags
    const filter = getFilter(dto.query, dto.tags);

    try {
      // We match for the filter, sort the result
      // Then we group the results to get the min, max and average weight considering the additionalValue
      // Then we set the heaviest based on the largest value or additionalValue
      // There is no $sort expression that would allow us to sort by the maximum of the 2 fields (value & additionalValue)
      const statistics = await this.itemModel.aggregate<ItemStatistics>([
        { $match: filter },
        { $sort: { 'weight.value': -1 } },
        {
          $group: {
            _id: null,
            min: { $min: '$weight.value' },
            averageWeight: {
              $avg: { $avg: ['$weight.value', '$weight.additionalValue'] },
            },
            max: {
              $max: { $max: ['$weight.additionalValue', '$weight.value'] },
            },
            items: { $push: '$$ROOT' },
          },
        },
        {
          $set: {
            heaviest: {
              $first: {
                $filter: {
                  input: '$items',
                  as: 'item',
                  cond: {
                    $eq: [
                      {
                        $max: [
                          '$$item.weight.value',
                          '$$item.weight.additionalValue',
                        ],
                      },
                      '$max',
                    ],
                  },
                },
              },
            },
          },
        },
        { $set: { lightest: { $last: '$items' } } },
        { $project: { heaviest: 1, lightest: 1, averageWeight: 1 } },
      ]);

      if (!statistics[0]?.averageWeight) {
        this.logger.log('No items found');
        // Just to jump into the catch
        throw new NotFoundException('No items found');
      }
      this.logger.debug(
        `Finished in ${performance.now() - itemStatisticsQueryStartTime} ms`,
      );

      return statistics[0];
    } catch (error) {
      this.logger.debug(
        `Failed after ${performance.now() - itemStatisticsQueryStartTime} ms`,
      );
      this.logger.error(error);
      if (error instanceof NotFoundException) throw error;
      /* istanbul ignore next */
      throw new InternalServerErrorException(
        'Item statistics could not be retrieved',
      );
    }
  }
}
