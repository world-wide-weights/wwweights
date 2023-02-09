import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Page } from '../../shared/interfaces/page';
import { TagSortEnum } from './tag-sort-enum';

export class QueryTagListDto extends Page {
  @IsOptional()
  @IsEnum(TagSortEnum)
  @ApiPropertyOptional({
    enum: TagSortEnum,
    default: TagSortEnum.ASC,
    example: TagSortEnum.ASC,
    description: 'Sort order',
  })
  sort = TagSortEnum.ASC;
}
