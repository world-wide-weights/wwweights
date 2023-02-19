import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Tag } from '../models/tag.model';
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
  private readonly logger = new Logger(TagsController.name);

  constructor(private queryBus: QueryBus) {}

  @Get('list')
  @ApiOperation({ summary: 'Get tag list paginated' })
  @ApiOkResponse({
    type: PaginatedResponse<Tag>,
    description: 'Paginated result of tags',
  })
  async getTagsList(@Query() dto: QueryTagListDto) {
    this.logger.log(`Get tag list`);
    const result = await this.queryBus.execute(new TagListQuery(dto));
    return new PaginatedResponse<Tag>(result, Tag);
  }

  @Get('related')
  @ApiOperation({ summary: 'Get tags related to the itemssearch' })
  @ApiOkResponse({
    type: PaginatedResponse<TagWithRelevance>,
    status: 200,
    description: 'Paginated result of tags',
  })
  async getTagsRelated(@Query() dto: QueryTagRelatedDto) {
    this.logger.log(
      `Get related tag list for ${{ query: dto.query, tags: dto.tags }}`,
    );
    const result = await this.queryBus.execute(new TagRelatedQuery(dto));
    return new PaginatedResponse<TagWithRelevance>(result, TagWithRelevance);
  }
}
