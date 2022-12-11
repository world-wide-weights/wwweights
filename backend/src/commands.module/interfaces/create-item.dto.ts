import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class Weight {
  @IsString()
  @ApiProperty()
  value: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  isCa = false;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  additional_range_value: string;
}

export class CreateItemDto {
  // TODO: Slug here or on event write
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ValidateNested()
  @ApiProperty()
  @Type(() => Weight)
  weight: Weight;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  tags: string[];

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  image: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  source: string;

  @IsString()
  @ApiProperty()
  user: string;
}
