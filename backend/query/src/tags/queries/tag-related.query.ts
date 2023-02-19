import { QueryTagRelatedDto } from '../dtos/query-tag-related.dto';

/**
 * @description Query to retrieve related tags for an item list search
 */
export class TagRelatedQuery {
  constructor(public readonly dto: QueryTagRelatedDto) {}
}
