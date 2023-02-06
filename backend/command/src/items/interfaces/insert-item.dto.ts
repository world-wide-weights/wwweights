import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Weight {
  @IsNumber()
  @ApiProperty({
    default: 1.234e10,
    type: String,
    example: 1.234e10,
    description: 'Weight in grams',
  })
  value: number;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    default: false,
    type: Boolean,
    example: true,
    description: 'Is the weight not exact, then it is ca. xxx',
  })
  isCa?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    example: 5.678e10,
    description: 'Additional weight in grams',
  })
  additionalValue?: number;
}

export class InsertItemDto {
  // TODO: Slug here or on event write
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'my-item',
    description: 'Unique item name',
  })
  name: string;

  @ValidateNested()
  @ApiProperty({
    type: Weight,
    description: 'Weight object',
    example: { value: 1.234e10, isCa: false, additionalValue: 5.678e10 },
  })
  @Type(() => Weight)
  weight: Weight;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    type: [String],
    description: 'Tags',
    example: ['tag1', 'tag2'],
  })
  @Type(() => String)
  tags?: string[];

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Image URL or path for imageStore',
    example: 'https://link.de/image.png',
  })
  image?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Source URL',
    example: 'https://link.de',
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
