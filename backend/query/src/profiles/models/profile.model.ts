import { ApiResponseProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';

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
  @ApiResponseProperty()
  @Type(() => ProfileCounts)
  @prop({ type: () => ProfileCounts, _id: false })
  count: ProfileCounts;

  constructor(partial: Partial<Profile>) {
    Object.assign(this, partial);
  }
}
