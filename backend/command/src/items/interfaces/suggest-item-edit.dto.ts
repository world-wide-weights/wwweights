import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { InsertItemDto } from './insert-item.dto';

class SuggestItemEditTagsDTO {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({ description: 'Tags that should be added to the item tags', example: ['healthy'] })
  push: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Tags that should be removed from the item tags',
    example: ['fruit']
  })
  pull: string[];
}

export class SuggestItemEditDTO extends PartialType(
  OmitType(InsertItemDto, ['tags'] as const),
) {
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Tags that are pulled from and pushed to the item tags',
    type: SuggestItemEditTagsDTO,
  })
  @Type(() => SuggestItemEditTagsDTO)
  tags?: SuggestItemEditTagsDTO;
}
