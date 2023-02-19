import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Page } from '../../shared/interfaces/page.interface';
import { TagSortEnum } from '../enums/tag-sort-enum';

/**
 * @description Query DTO to retrieve a list of tags
 */
export class QueryTagListDto extends Page {
  @IsOptional()
  @IsEnum(TagSortEnum)
  @ApiPropertyOptional({
    enum: TagSortEnum,
    default: TagSortEnum.ASC,
    description: 'Sort order',
  })
  sort = TagSortEnum.ASC;
}
