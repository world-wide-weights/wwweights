import { AggregateRoot } from '@nestjs/cqrs';
import { prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';

export class Tag extends AggregateRoot {
  @Expose()
  @prop({ required: true })
  name: string;

  @Expose()
  @prop({ required: true })
  count: number;

  constructor(partial: Partial<Tag>) {
    super();
    Object.assign(this, partial);
  }
}
