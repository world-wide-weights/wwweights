import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Tag } from '../models/tag.model';
import { ApiOkResponsePaginated } from '../shared/decorators/paginated-ok-response.decorator';
import { PaginatedResponse } from '../shared/interfaces/paginated-result.interface';
import { QueryTagListDto } from './dtos/query-tag-list.dto';
import { QueryTagRelatedDto } from './dtos/query-tag-related.dto';
import { TagWithRelevance } from './interfaces/tag-with-relevance.interface';
import { TagListQuery } from './queries/tag-list.query';
import { TagRelatedQuery } from './queries/tag-related.query';

@Controller('tags')
@ApiTags('tags')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class TagsController {
  constructor(private queryBus: QueryBus) {}

  @Get('list')
  @ApiOperation({ summary: 'Get tag list paginated' })
  @ApiOkResponsePaginated(Tag)
  async getTagsList(
    @Query() dto: QueryTagListDto,
  ): Promise<PaginatedResponse<Tag>> {
    const result = await this.queryBus.execute(new TagListQuery(dto));
    return new PaginatedResponse<Tag>(result, Tag);
  }

  @Get('related')
  @ApiOperation({ summary: 'Get tags related to the itemssearch paginated' })
  @ApiOkResponsePaginated(TagWithRelevance)
  async getTagsRelated(
    @Query() dto: QueryTagRelatedDto,
  ): Promise<PaginatedResponse<TagWithRelevance>> {
    const result = await this.queryBus.execute(new TagRelatedQuery(dto));
    return new PaginatedResponse<TagWithRelevance>(result, TagWithRelevance);
  }
}
