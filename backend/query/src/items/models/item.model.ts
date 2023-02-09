import { AggregateRoot } from '@nestjs/cqrs';
import { ApiResponseProperty } from '@nestjs/swagger';
import { index, prop } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';

class Weight {
  @Expose()
  @prop({ required: true })
  @ApiResponseProperty({ type: Number, example: 1.234e10 })
  // This is always in grams and scientific notation example: 1.234e10
  value: number;

  @Expose()
  @prop()
  @ApiResponseProperty({ type: Boolean, example: true })
  isCa?: boolean;

  @Expose()
  @prop()
  @ApiResponseProperty({ type: Number, example: 5.678e10 })
  additionalValue?: number;
}

// To simplify here is Tag again but without the Aggregate since the Tag in Items does not have to look the same as the Tag alone and a composition type is too much work
class Tag {
  @Expose()
  @prop({ required: true })
  @ApiResponseProperty({ type: String, example: 'Tag Name' })
  name: string;

  @Expose()
  @prop({ required: true, default: -1 }) // so we can increment it with everyone else
  @ApiResponseProperty({ type: Number, example: 3 })
  count?: number;
}

@index(
  { name: 'text', 'tags.name': 'text' },
  { weights: { name: 1000, tags: 1 }, name: 'ItemTextIndex' },
)
export class Item extends AggregateRoot {
  @Expose()
  @prop({ required: true })
  @ApiResponseProperty({ type: String, example: 'Item Name' })
  name: string;

  @Expose()
  @prop({ required: true, unique: true })
  @ApiResponseProperty({ type: String, example: 'item-name' })
  slug: string;

  @Expose()
  @prop({ type: () => Weight, _id: false })
  @Type(() => Weight)
  @ApiResponseProperty({
    type: Weight,
    example: { value: 1.234e10, isCa: true, additionalValue: 5.678e10 },
  })
  weight: Weight;

  @Expose()
  @prop({ array: true, type: () => [Tag], _id: false })
  @Type(() => Tag)
  @ApiResponseProperty({
    type: [Tag],
    example: [{ name: 'Tag Name', count: 3 }],
  })
  tags?: Tag[];

  @Expose()
  @prop()
  @ApiResponseProperty({ type: String, example: 'https://link.de/img.png' })
  image?: string;

  @Expose()
  @prop()
  @ApiResponseProperty({ type: String, example: 'https://link.de/stuff' })
  source?: string;

  @Expose()
  @prop()
  @ApiResponseProperty({ type: String, example: 123 })
  user: number;

  @Expose()
  @prop()
  @ApiResponseProperty({ type: Number, example: 1234567890000 })
  createdAt?: number;

  constructor(partial: Partial<Item>) {
    super();
    Object.assign(this, partial);
  }
}
