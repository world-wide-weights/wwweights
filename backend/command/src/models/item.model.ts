import { AggregateRoot } from '@nestjs/cqrs';
import { index, prop } from '@typegoose/typegoose';
import { IsString } from 'class-validator';

export class Weight {
  @prop({ required: true })
  // This is always in grams and scientific notation example: 1.234e10
  value: number;

  @prop()
  isCa?: boolean;

  @prop()
  additionalValue?: number;
}

// To simplify here is Tag again but without the Aggregate since the Tag in Items does not have to look the same as the Tag alone and a composition type is too much work
class Tag {
  @prop({ required: true })
  name: string;

  @prop({ required: true, default: -1 }) // so we can increment it with everyone else
  count?: number;
}

@index(
  { name: 'text', 'tags.name': 'text' },
  { weights: { name: 1000, tags: 1 }, name: 'ItemTextIndex' },
)
export class Item extends AggregateRoot {
  @prop({ required: true })
  name: string;

  @prop({ required: true, unique: true })
  slug: string;

  @prop({ type: () => Weight, _id: false })
  weight: Weight;

  @prop({ array: true, type: () => [Tag], _id: false })
  tags?: Tag[];

  @prop()
  image?: string; // Link to static store or base-64 Encoded?

  @prop()
  source?: string;

  @prop()
  userId: number;

  @prop()
  createdAt?: number;

  constructor(partial: Partial<Item>) {
    super();
    Object.assign(this, partial);
  }
}
