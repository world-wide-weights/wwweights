import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { InsertItemDto, Weight } from './insert-item.dto';

/**
 * @description DTO for weight when suggesting item edit (inherits from Insert weight DTO)
 */
class SuggestItemEditWeightDTO extends PartialType(
  OmitType(Weight, ['additionalValue']),
) {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiPropertyOptional({
    exclusiveMinimum: true,
    minimum: 0,
    description:
      'Additional value of weight in gramm. Has to be bigger than value. Use this if you have a range weight',
    example: 250,
  })
  additionalValue?: number;
}

/**
 * @description DTO for tags when suggesting item edit
 */
class SuggestItemEditTagsDTO {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Tags that should be added to the item tags',
    example: ['healthy'],
    type: String,
    isArray: true,
  })
  push: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Tags that should be removed from the item tags',
    example: ['fruit'],
  })
  pull: string[];
}

/**
 * @description DTO for suggesting item edit (inherits from Insert DTO)
 */
export class SuggestItemEditDTO extends PartialType(
  OmitType(InsertItemDto, ['tags', 'weight'] as const),
) {
  @IsOptional()
  @ValidateNested()
  @ApiPropertyOptional({
    description: 'Tags that are pulled from and pushed to the item tags',
    type: SuggestItemEditTagsDTO,
  })
  @Type(() => SuggestItemEditTagsDTO)
  tags?: SuggestItemEditTagsDTO;

  @IsOptional()
  @ValidateNested()
  @ApiPropertyOptional({
    description: 'Weight values for item',
    type: SuggestItemEditWeightDTO,
  })
  @Type(() => SuggestItemEditWeightDTO)
  weight?: SuggestItemEditWeightDTO;
}
