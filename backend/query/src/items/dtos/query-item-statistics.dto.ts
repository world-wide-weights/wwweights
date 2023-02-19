import { PickType } from '@nestjs/swagger';
import { QueryTagsAndPage } from '../../shared/interfaces/queryTagsAndPage';

export class QueryItemStatisticsDto extends PickType(QueryTagsAndPage, [
  'query',
  'tags',
]) {}
