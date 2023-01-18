import { prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { Item } from './item.model';

export class Tag {
  @Expose()
  @prop({ required: true })
  name: string;

  // TODO: Add relevant Account data

  @Expose()
  @prop({ required: true })
  slug: string;

  @Expose()
  @prop({ required: true, default: 0 })
  count: Item;
}
