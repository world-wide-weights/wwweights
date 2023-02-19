import { QueryProfileStatisticsDto } from '../dtos/query-profile-statistics.dto';

/**
 * @description The ProfileStatisticsQuery class is used to retrieve the statistics for a profile
 */
export class ProfileStatisticsQuery {
  constructor(public readonly dto: QueryProfileStatisticsDto) {}
}
