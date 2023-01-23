import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { Item } from '../../models/item.model';
import { getFilter } from '../../shared/get-filter';
import { ItemStatistics } from '../interfaces/item-statistics';
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
      // We currently also run textSearch on tags, optimizing via itemsByTags is a TODO
      const filter = getFilter(dto.query, dto.tags);

      // TODO: Query through itemsByTags if tags are listed
      const facetedStatistics = await this.itemModel.aggregate([
        { $match: filter },
        {
          $facet: {
            heaviest: [
              { $group: { _id: null, max: { $max: '$weight.value' } } },
            ],
            lightest: [
              { $group: { _id: null, min: { $min: '$weight.value' } } },
            ],
            averageWeight: [
              { $group: { _id: null, avg: { $avg: '$weight.value' } } },
            ],
          },
        },
      ]);

      this.logger.error(facetedStatistics[0]);
      return facetedStatistics[0];
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException(
        'Item list could not be retrieved',
      );
    }
  }
}
