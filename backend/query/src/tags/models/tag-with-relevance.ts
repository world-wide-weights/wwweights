import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Tag } from './tag.model';

export class TagWithRelevance extends Tag {
  @Expose()
  @ApiResponseProperty({ type: Number })
  relevance: number;

  constructor(partial: Partial<TagWithRelevance>) {
    super(partial);
    Object.assign(this, partial);
  }
}
