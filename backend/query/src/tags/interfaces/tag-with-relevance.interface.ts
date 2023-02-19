import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Tag } from '../../models/tag.model';

/**
 * @description Tag with relevance for the frontend to display relevance
 */
export class TagWithRelevance extends Tag {
  @Expose()
  @ApiResponseProperty({ example: 69 })
  relevance: number;

  constructor(partial: Partial<TagWithRelevance>) {
    super(partial);
    Object.assign(this, partial);
  }
}
