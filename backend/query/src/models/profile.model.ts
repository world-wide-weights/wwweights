import { ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';

/**
 * @description The Profile counts
 */
export class ProfileCounts {
  @Expose()
  @prop()
  @ApiProperty({ description: 'Number of total items created', example: 69 })
  itemsCreated: number;

  @Expose()
  @prop()
  @ApiProperty({
    description: 'Number of total approved suggestions',
    example: 69,
  })
  itemsUpdated: number;

  @Expose()
  @prop()
  @ApiProperty({ description: 'Number of total items created', example: 69 })
  tagsUsedOnCreation: number;

  @Expose()
  @prop()
  @ApiProperty({
    description: 'Number of total tags pushed on approved suggestions',
    example: 69,
  })
  tagsUsedOnUpdate: number;

  @Expose()
  @prop()
  @ApiProperty({
    description: 'Number of sources provided for creation',
    example: 69,
  })
  sourceUsedOnCreation: number;

  @Expose()
  @prop()
  @ApiProperty({
    description: 'Number of sources edited in approved suggestions',
    example: 69,
  })
  sourceUsedOnUpdate: number;

  @Expose()
  @prop()
  @ApiProperty({
    description: 'Number of images provided for creation',
    example: 69,
  })
  imageAddedOnCreation: number;

  @Expose()
  @prop()
  @ApiProperty({
    description: 'Number of images edited in approved suggestions',
    example: 69,
  })
  imageAddedOnUpdate: number;

  @Expose()
  @prop()
  @ApiProperty({
    description: 'Number of items with additionalValues created',
    example: 69,
  })
  additionalValueOnCreation: number;

  @Expose()
  @prop()
  @ApiProperty({
    description: 'Number of additionalValues edited on approved suggestions',
    example: 69,
  })
  additionalValueOnUpdate: number;

  @Expose()
  @prop()
  @ApiProperty({
    description:
      'Number of items deleted by suggesting it or deleting own items',
    example: 420,
  })
  itemsDeleted: number;
}

/**
 * @description The Profile model currently only containing statistics
 */
export class Profile {
  @Expose()
  @ApiProperty({ description: 'The user id', example: 1 })
  @prop({ required: true, unique: true })
  userId: number;

  @Expose()
  @ApiProperty({
    type: ProfileCounts,
    description: 'The counts holding statistic information',
  })
  @Type(() => ProfileCounts)
  @prop({ type: () => ProfileCounts, _id: false })
  count: ProfileCounts;

  constructor(partial: Partial<Profile>) {
    Object.assign(this, partial);
  }
}
