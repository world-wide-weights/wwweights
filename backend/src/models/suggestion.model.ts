import { prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { Item } from './item.model';

export class Suggestion {
  @Expose()
  @prop({ required: true })
  author: string;

  // TODO: Add relevant Account data

  @Expose()
  @prop({ required: true })
  previousItem: Item;

  @Expose()
  @prop({ required: true })
  newItem: Item;
}
