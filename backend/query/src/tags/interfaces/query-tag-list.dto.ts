import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Page } from '../../shared/page';
import { TagSortEnum } from './tag-sort-enum';

export class QueryTagListDto extends Page {
  @IsOptional()
  @IsEnum(TagSortEnum)
  @ApiPropertyOptional({ enum: TagSortEnum, default: TagSortEnum.ASC })
  sort = TagSortEnum.ASC;
}
