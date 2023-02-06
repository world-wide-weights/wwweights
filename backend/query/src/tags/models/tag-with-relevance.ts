import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Tag } from './tag.model';

export class TagWithRelevance extends Tag {
  @Expose()
  @ApiResponseProperty({ type: Number, example: 69 })
  relevance: number;

  constructor(partial: Partial<TagWithRelevance>) {
    super(partial);
    Object.assign(this, partial);
  }
}
