import { AggregateRoot } from '@nestjs/cqrs';
import { ApiResponseProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';

export class Tag extends AggregateRoot {
  @Expose()
  @prop({ required: true, unique: true })
  @ApiResponseProperty({ type: String })
  name: string;

  @Expose()
  @prop({ required: true, default: 1 })
  @ApiResponseProperty({ type: Number })
  count: number;

  constructor(partial: Partial<Tag>) {
    super();
    Object.assign(this, partial);
  }
}
