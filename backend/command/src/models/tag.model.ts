import { prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';

/**
 * @description Entity/Model for tag in read db
 */
export class Tag {
  @Expose()
  @prop({ required: true, unique: true })
  name: string;

  @Expose()
  @prop({ required: true, default: 1 })
  count: number;

  constructor(partial: Partial<Tag>) {
    Object.assign(this, partial);
  }
}
