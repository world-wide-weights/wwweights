import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateItemDto {
  // TODO: Slug here or on event write
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNumber()
  @ApiProperty()
  // @Transform((params) => parseFloat(params.obj.value))
  // This is always in grams and scientific notation example: 1.234e10
  value: number;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  isCa: boolean;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  // @Transform((params) => {
  //   return parseFloat(params.obj.additional_range_value) || null;
  // })
  additional_range_value: number;

  @IsString({ each: true })
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
