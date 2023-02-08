import { PickType } from '@nestjs/swagger';
import { QueryTagsAndPage } from '../../shared/queryTagsAndPage';

export class QueryItemStatisticsDto extends PickType(QueryTagsAndPage, [
  'query',
  'tags',
]) {}
