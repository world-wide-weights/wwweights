import { PickType } from '@nestjs/swagger';
import { QueryTagsAndPage } from '../../shared/interfaces/queryTagsAndPage';

/**
 * @description Query DTO to retrieve statistics for an item search
 */
export class QueryItemStatisticsDto extends PickType(QueryTagsAndPage, [
  'query',
  'tags',
]) {}
