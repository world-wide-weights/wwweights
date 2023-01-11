import { prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { Item } from './item.model';
import { Tag } from './tag.model';

export class ItemsByTag {
  @Expose()
  @prop({ required: true, unique: true, type: () => Tag })
  tag: Tag;

  @Expose()
  @prop({ array: true, type: () => [Item] })
  items: Item[];
}
