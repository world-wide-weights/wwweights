import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { index, prop } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { Tag } from './tag.model';

/**
 * @description Values defining a Weight or Range
 */
class Weight {
  @Expose()
  @prop({ required: true })
  @ApiResponseProperty({ type: Number, example: 1.234e10 })
  // This is always in grams
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

/**
 * @description The Item model containing a textSearch index on name and tags weighted 1000/1 respectively
 */
@index(
  { name: 'text', 'tags.name': 'text' },
  { weights: { name: 1000, tags: 1 }, name: 'ItemTextIndex' },
)
export class Item {
  @Expose()
  @prop({ required: true })
  @ApiResponseProperty({ example: 'Apple' })
  name: string;

  @Expose()
  @prop({ required: true, unique: true })
  @ApiResponseProperty({ example: 'apple' })
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
  @prop({ array: true, type: () => [Tag], _id: false, excludeIndexes: true })
  @Type(() => Tag)
  @ApiProperty({
    type: Tag,
    isArray: true,
    example: [{ name: 'fruit', count: 3 }],
  })
  tags?: Tag[];

  @Expose()
  @prop()
  @ApiResponseProperty({
    example:
      'https://wordpress.shuffle-projekt.de/wp-content/uploads/2021/11/Kuhn_Korbinian-400x400.jpg',
  })
  image?: string;

  @Expose()
  @prop()
  @ApiResponseProperty({
    example: 'https://www.quora.com/What-is-the-average-weight-of-an-Apple',
  })
  source?: string;

  @Expose()
  @prop()
  @ApiResponseProperty({ example: 123 })
  userId: number;

  @Expose()
  @prop()
  @ApiResponseProperty({ example: 1234567890000 })
  createdAt?: number;

  constructor(partial: Partial<Item>) {
    Object.assign(this, partial);
  }
}
