import { AggregateRoot } from '@nestjs/cqrs';
import { index, prop } from '@typegoose/typegoose';
import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class Weight {
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

@index({ name: 'text', tags: 'text' }, { weights: { name: 10, tags: 5 } })
@Expose()
export class Item extends AggregateRoot {
  @Expose({ name: 'id' })
  // Have to do this optionally since it would throw an error on plainToInstance because _id doesn't exist in the DTOs and we only need it on instanceToPlain
  @Transform((params) => params.obj._id?.toString())
  _id?: ObjectId;

  @Expose()
  @prop({ required: true, unique: true })
  name: string;

  @Expose()
  @prop({ required: true, unique: true })
  slug: string;

  @Expose()
  @prop({ type: () => Weight, _id: false })
  weight: Weight;

  @Expose()
  @prop({ array: true, type: () => [String] })
  //@ManyToMany(() => Tag, (tag) => tag.items) No Tags yet
  tags?: string[];

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
