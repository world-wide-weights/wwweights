import { index, prop } from '@typegoose/typegoose';
import { Tag } from './tag.model';

/**
 * @description Entity/Model for weight of item in read db
 */
export class Weight {
  @prop({ required: true })
  // This is always in grams and scientific notation example: 1.234e10
  value: number;

  @prop()
  isCa?: boolean;

  @prop()
  additionalValue?: number;
}

/**
 * @description Entity/Model for item in read db
 */
@index(
  { name: 'text', 'tags.name': 'text' },
  { weights: { name: 1000, tags: 1 }, name: 'ItemTextIndex' },
)
export class Item {
  @prop({ required: true })
  name: string;

  @prop({ required: true, unique: true })
  slug: string;

  @prop({ type: () => Weight, _id: false })
  weight: Weight;

  @prop({ array: true, type: () => [Tag], _id: false, excludeIndexes: true })
  tags?: Tag[];

  @prop()
  image?: string;

  @prop()
  source?: string;

  @prop()
  userId: number;

  @prop()
  createdAt?: number;

  constructor(partial: Partial<Item>) {
    Object.assign(this, partial);
  }
}
