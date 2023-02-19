import { QueryItemRelatedDto } from '../dtos/query-item-related.dto';

/**
 * @description Query to get related items to one given item
 */
export class ItemRelatedQuery {
  constructor(public readonly dto: QueryItemRelatedDto) {}
}
