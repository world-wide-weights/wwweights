import { QueryItemListDto } from '../dtos/query-item-list.dto';

/**
 * @description Query to retrieve a list of items
 */
export class ItemListQuery {
  constructor(public readonly dto: QueryItemListDto) {}
}
