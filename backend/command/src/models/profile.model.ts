import { ApiResponseProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';

export class ProfileCounts {
  @Expose()
  @prop()
  @ApiResponseProperty()
  itemsCreated: number;
  @Expose()
  @prop()
  @ApiResponseProperty()
  itemsUpdated: number;
  @Expose()
  @prop()
  @ApiResponseProperty()
  tagsUsedOnCreation: number;
  @Expose()
  @prop()
  @ApiResponseProperty()
  tagsUsedOnUpdate: number;
  @Expose()
  @prop()
  @ApiResponseProperty()
  sourceUsedOnCreation: number;
  @Expose()
  @prop()
  @ApiResponseProperty()
  sourceUsedOnUpdate: number;
  @Expose()
  @prop()
  @ApiResponseProperty()
  imageAddedOnCreation: number;
  @Expose()
  @prop()
  @ApiResponseProperty()
  imageAddedOnUpdate: number;
  @Expose()
  @prop()
  @ApiResponseProperty()
  additionalValueOnCreation: number;
  @Expose()
  @prop()
  @ApiResponseProperty()
  additionalValueOnUpdate: number;
  @Expose()
  @prop()
  @ApiResponseProperty()
  itemsDeleted: number;
}
export class Profile {
  @Expose()
  @prop({ required: true, unique: true })
  userId: number;

  @Expose()
  @prop({ type: () => ProfileCounts, _id: false })
  count: ProfileCounts;

  // Since we currently don't look for items and suggestions created, we omit this. N
  // But we can always fetch them by adding an index on items on the userId and then looking for matches
}
