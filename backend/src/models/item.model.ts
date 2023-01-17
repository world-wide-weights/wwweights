import { AggregateRoot } from '@nestjs/cqrs';
import { index, prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';

class Weight {
  @Expose()
  @prop({ required: true })
  // This is always in grams and scientific notation example: 1.234e10
  value: number;

  @Expose()
  @prop()
  isCa? = false;

  @Expose()
  @prop()
  aditionalValue?: number;
}

// To simplify here is Tag again but without the Aggregate since the Tag in Items does not have to look the same as the Tag alone
class Tag {
  @Expose()
  @prop({ required: true })
  name: string;

  @Expose()
  @prop()
  slug?: string;

  @Expose()
  @prop()
  count?: number;
}

@index(
  { name: 'text', 'tags.name': 'text' },
  { weights: { name: 10, tags: 5 }, name: 'ItemTextIndex' },
)
export class Item extends AggregateRoot {
  @Expose()
  @prop({ required: true })
  name: string;

  @Expose()
  @prop({ required: true, unique: true })
  slug: string;

  @Expose()
  @prop({ type: () => Weight, _id: false })
  weight: Weight;

  @Expose()
  @prop({ array: true, type: () => [Tag], _id: false })
  tags?: Tag[];

  @Expose()
  @prop()
  image?: string; // Link to static store or base-64 Encoded?

  @Expose()
  @prop()
  source?: string;

  @Expose()
  @prop()
  user: string;

  constructor(partial: Partial<Item>) {
    super();
    Object.assign(this, partial);
  }
}
