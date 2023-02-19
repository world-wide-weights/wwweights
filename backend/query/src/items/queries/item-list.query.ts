import { QueryItemListDto } from '../dtos/query-item-list.dto';

export class ItemListQuery {
  constructor(public readonly dto: QueryItemListDto) {}
}
