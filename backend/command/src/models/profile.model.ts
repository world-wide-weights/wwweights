import { prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';

export class ProfileCounts {
  @Expose()
  @prop()
  itemsCreated: number;
  @Expose()
  @prop()
  itemsUpdated: number;
  @Expose()
  @prop()
  tagsUsedOnCreation: number;
  @Expose()
  @prop()
  tagsUsedOnUpdate: number;
  @Expose()
  @prop()
  sourceUsedOnCreation: number;
  @Expose()
  @prop()
  sourceUsedOnUpdate: number;
  @Expose()
  @prop()
  imageAddedOnCreation: number;
  @Expose()
  @prop()
  imageAddedOnUpdate: number;
  @Expose()
  @prop()
  additionalValueOnCreation: number;
  @Expose()
  @prop()
  additionalValueOnUpdate: number;
  @Expose()
  @prop()
  itemsDeleted: number;
}
export class Profile {
  @Expose()
  @prop({ required: true, unique: true })
  userId: number;

  @Expose()
  @prop({ type: () => ProfileCounts, _id: false })
  count: ProfileCounts;
}
