import { AggregateRoot } from '@nestjs/cqrs';
import { ApiResponseProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';

export class Tag extends AggregateRoot {
  @Expose()
  @prop({ required: true, unique: true })
  @ApiResponseProperty({ type: String, example: 'tag1' })
  name: string;

  @Expose()
  @prop({ required: true, default: 1 })
  @ApiResponseProperty({ type: Number, example: 3 })
  count: number;

  constructor(partial: Partial<Tag>) {
    super();
    Object.assign(this, partial);
  }
}
