import { AggregateRoot } from '@nestjs/cqrs';
import { prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';

export class Tag extends AggregateRoot {
  @Expose()
  @prop({ required: true })
  name: string;

  // TODO: Add relevant Account data

  @Expose()
  @prop({ required: true, unique: true })
  slug: string;

  @Expose()
  @prop({ required: true, default: 1 }) // Default is 1, because when you create it, it is attached to an Item
  count: number;

  constructor(partial: Partial<Tag>) {
    super();
    Object.assign(this, partial);
  }
}
