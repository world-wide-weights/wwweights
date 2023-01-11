import { prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { Item } from './item.model';

export class ItemsByTag {
  @Expose()
  @prop({ required: true, unique: true })
  tag: string;

  @Expose()
  @prop({ array: true, type: () => [Item] })
  items: Item[];
}
