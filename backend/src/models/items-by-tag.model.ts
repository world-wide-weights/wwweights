import { AggregateRoot } from '@nestjs/cqrs';
import { prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { Item } from './item.model';

// TODO: Figure out if we can exclude some indexes or if it is usefull to have 2 full text search indexes
// TODO: If we do not exclude the indexes, they are considered the same, meaning that we can't insert an Item into the ItemsByTag collection if it already exists in the Item collection
// TODO: But we kinda still want the indexes to be able to search over the ItemsByTag collection, tho that is a rare usecase, but might take very long
export class ItemsByTag extends AggregateRoot {
  @Expose()
  @prop({ required: true, unique: true })
  tagName: string;

  @Expose()
  @prop({
    array: true,
    type: () => [Item],
    excludeIndexes: true,
    _id: false,
  })
  items: Item[];

  constructor(Partial: Partial<ItemsByTag>) {
    super();
    Object.assign(this, Partial);
  }
}
