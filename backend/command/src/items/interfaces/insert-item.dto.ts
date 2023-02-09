import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsBiggerThan } from '../../shared/validators/is-bigger-than';

class Weight {
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    exclusiveMinimum: true,
    minimum: 0,
    description: 'Value of weight in gram.',
    example: 150,
  })
  value: number;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    default: false,
    description: 'Set whether the weight is an approximate weight.',
    example: true,
  })
  isCa?: boolean;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @IsBiggerThan('value', {
    message: 'additionalValue has to be bigger than value',
  })
  @ApiPropertyOptional({
    exclusiveMinimum: true,
    minimum: 0,
    description:
      'Additional value of weight in gramm. Has to be bigger than value. Use this if you have a range weight.',
    example: 250,
  })
  additionalValue?: number;
}

export class InsertItemDto {
  // TODO: Slug here or on event write
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the item.', example: 'Apple' })
  name: string;

  @ValidateNested()
  @Type(() => Weight)
  @ApiProperty({
    type: Weight,
    description: 'Weight of the item.',
    example: { value: 150, isCa: false, additionalValue: 250 },
  })
  weight: Weight;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({
    type: [String],
    description: 'Tags of the item.',
    example: ['fruit', 'red'],
  })
  tags?: string[];

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Image URL or path for imageStore',
    example: 'https://example.com/image.png',
  })
  image?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'Source of weight for item. Can be an URL or any other format of string.',
    example: 'https://example.com',
  })
  source?: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'User ID',
    example: '5f9e9b9e7c9d440000a1c1c7',
  })
  user: string;
}
