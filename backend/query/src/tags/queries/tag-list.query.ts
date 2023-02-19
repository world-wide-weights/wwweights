import { QueryTagListDto } from '../dtos/query-tag-list.dto';

/**
 * @description Query to retrieve a list of tags
 */
export class TagListQuery {
  constructor(public readonly dto: QueryTagListDto) {}
}
