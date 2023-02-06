import { AggregateRoot } from '@nestjs/cqrs';
import { ApiResponseProperty } from '@nestjs/swagger';
import { index, prop } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';

class Weight {
  @Expose()
  @prop({ required: true })
  @ApiResponseProperty({ type: Number })
  // This is always in grams and scientific notation example: 1.234e10
  value: number;

  @Expose()
  @prop()
  @ApiResponseProperty({ type: Boolean })
  isCa?: boolean;

  @Expose()
  @prop()
  @ApiResponseProperty({ type: Number })
  additionalValue?: number;
}

// To simplify here is Tag again but without the Aggregate since the Tag in Items does not have to look the same as the Tag alone and a composition type is too much work
class Tag {
  @Expose()
  @prop({ required: true })
  @ApiResponseProperty({ type: String })
  name: string;

  @Expose()
  @prop({ required: true, default: -1 }) // so we can increment it with everyone else
  @ApiResponseProperty({ type: Number })
  count?: number;
}

@index(
  { name: 'text', 'tags.name': 'text' },
  { weights: { name: 10, tags: 5 }, name: 'ItemTextIndex' },
)
export class Item extends AggregateRoot {
  @Expose()
  @prop({ required: true })
  @ApiResponseProperty({ type: String })
  name: string;

  @Expose()
  @prop({ required: true, unique: true })
  @ApiResponseProperty({ type: String })
  slug: string;

  @Expose()
  @prop({ type: () => Weight, _id: false })
  @Type(() => Weight)
  @ApiResponseProperty({ type: Weight })
  weight: Weight;

  @Expose()
  @prop({ array: true, type: () => [Tag], _id: false })
  @Type(() => Tag)
  @ApiResponseProperty({ type: [Tag] })
  tags?: Tag[];

  @Expose()
  @prop()
  @ApiResponseProperty({ type: String })
  image?: string; // Link to static store or base-64 Encoded?

  @Expose()
  @prop()
  @ApiResponseProperty({ type: String })
  source?: string;

  @Expose()
  @prop()
  @ApiResponseProperty({ type: String })
  user: string;

  @Expose()
  @prop()
  @ApiResponseProperty({ type: Number })
  createdAt?: number;

  constructor(partial: Partial<Item>) {
    super();
    Object.assign(this, partial);
  }
}
