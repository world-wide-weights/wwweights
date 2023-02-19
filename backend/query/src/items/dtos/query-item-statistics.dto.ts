import { PickType } from '@nestjs/swagger';
import { QueryTagsAndPage } from '../../shared/interfaces/query-tags-and-page.interface';

/**
 * @description Query DTO to retrieve statistics for an item search
 */
export class QueryItemStatisticsDto extends PickType(QueryTagsAndPage, [
  'query',
  'tags',
]) {}
