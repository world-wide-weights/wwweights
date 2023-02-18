import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';

export class ProfileCounts {
  @Expose()
  @prop()
  @ApiProperty({ description: 'Number of total items created' })
  itemsCreated: number;

  @Expose()
  @prop()
  @ApiProperty({ description: 'Number of total approved suggestions' })
  itemsUpdated: number;

  @Expose()
  @prop()
  @ApiProperty({ description: 'Number of total items created' })
  tagsUsedOnCreation: number;

  @Expose()
  @prop()
  @ApiProperty({
    description: 'Number of total tags pushed on approved suggestions',
  })
  tagsUsedOnUpdate: number;

  @Expose()
  @prop()
  @ApiProperty({ description: 'Number of sources provided for creation' })
  sourceUsedOnCreation: number;

  @Expose()
  @prop()
  @ApiProperty({
    description: 'Number of sources edited in approved suggestions',
  })
  sourceUsedOnUpdate: number;

  @Expose()
  @prop()
  @ApiProperty({ description: 'Number of images provided for creation' })
  imageAddedOnCreation: number;

  @Expose()
  @prop()
  @ApiProperty({
    description: 'Number of images edited in approved suggestions',
  })
  imageAddedOnUpdate: number;

  @Expose()
  @prop()
  @ApiProperty({ description: 'Number of items with additionalValues created' })
  additionalValueOnCreation: number;

  @Expose()
  @prop()
  @ApiProperty({
    description: 'Number of additionalValues edited on approved suggestions',
  })
  additionalValueOnUpdate: number;

  @Expose()
  @prop()
  @ApiProperty({
    description:
      'Number of items deleted by suggesting it or deleting own items',
  })
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
