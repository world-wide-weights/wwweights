import { ApiResponseProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';

/**
 * @description The Tag model with an index on the name
 */
export class Tag {
  @Expose()
  @prop({ required: true, unique: true })
  @ApiResponseProperty({ example: 'fruit' })
  name: string;

  @Expose()
  @prop({ required: true, default: 1 })
  @ApiResponseProperty({ example: 3 })
  count: number;

  constructor(partial: Partial<Tag>) {
    Object.assign(this, partial);
  }
}
