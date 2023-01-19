import { AggregateRoot } from '@nestjs/cqrs';
import { prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { Item } from './item.model';

// TODO: make sure the indexes are not taken from the Item model
export class ItemsByTag extends AggregateRoot {
  @Expose()
  @prop({ required: true, unique: true })
  tagName: string;

  @Expose()
  @prop({
    array: true,
    type: () => [Item],
    default: [],
    excludeIndexes: true,
    _id: false,
  })
  items: Item[];

  constructor(Partial: Partial<ItemsByTag>) {
    super();
    Object.assign(this, Partial);
  }
}
