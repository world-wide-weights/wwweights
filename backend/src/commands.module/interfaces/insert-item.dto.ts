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
  @ApiProperty({ default: '1.234e100' })
  value: number;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ default: false })
  isCa?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  aditionalValue?: number;
}

export class InsertItemTag {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  slug?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  count?: number;
}

export class InsertItemDto {
  // TODO: Slug here or on event write
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ValidateNested()
  @ApiProperty()
  @Type(() => Weight)
  weight: Weight;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ type: [InsertItemTag] })
  @ValidateNested({ each: true })
  @Type(() => InsertItemTag)
  tags?: InsertItemTag[];

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  image?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  source?: string;

  @IsString()
  @ApiProperty()
  user: string;
}
