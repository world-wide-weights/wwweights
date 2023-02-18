import { prop } from '@typegoose/typegoose';

/**
 * @description Entity/Model for profile counts in read db
 */
export class ProfileCounts {
  @prop()
  itemsCreated: number;

  @prop()
  itemsUpdated: number;

  @prop()
  tagsUsedOnCreation: number;

  @prop()
  tagsUsedOnUpdate: number;

  @prop()
  sourceUsedOnCreation: number;

  @prop()
  sourceUsedOnUpdate: number;

  @prop()
  imageAddedOnCreation: number;

  @prop()
  imageAddedOnUpdate: number;

  @prop()
  additionalValueOnCreation: number;

  @prop()
  additionalValueOnUpdate: number;

  @prop()
  itemsDeleted: number;
}

/**
 * @description Entity/Model for profile in read db
 */
export class Profile {
  @prop({ required: true, unique: true })
  userId: number;

  @prop({ type: () => ProfileCounts, _id: false })
  count: ProfileCounts;
}
