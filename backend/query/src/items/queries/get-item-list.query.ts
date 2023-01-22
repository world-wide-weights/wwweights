import { QueryItemListDto } from '../interfaces/query-item-list.dto';

export class GetItemListQuery {
  constructor(public readonly dto: QueryItemListDto) {}
}
