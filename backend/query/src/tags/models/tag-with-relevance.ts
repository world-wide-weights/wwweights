import { Expose } from 'class-transformer';
import { Tag } from './tag.model';

export class TagWithRelevance extends Tag {
  @Expose()
  relevance: number;

  constructor(partial: Partial<TagWithRelevance>) {
    super(partial);
    Object.assign(this, partial);
  }
}
