import { QueryItemStatisticsDto } from '../dtos/query-item-statistics.dto';

/**
 * @description Query to retrieve statistics for a list of items
 */
export class ItemStatisticsQuery {
  constructor(public readonly dto: QueryItemStatisticsDto) {}
}
