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
import { PaginatedResult } from '../shared/paginated-result';
import { QueryTagListDto } from './interfaces/query-tag-list.dto';
import { QueryTagRelatedDto } from './interfaces/query-tag-related.dto';
import { TagWithRelevance } from './models/tag-with-relevance';
import { Tag } from './models/tag.model';
import { TagRelatedQuery } from './queries/related-tags.query';
import { TagListQuery } from './queries/tag-list.query';

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
    type: PaginatedResult<Tag>,
    description: 'Paginated result of tags',
  })
  async getTagsList(@Query() dto: QueryTagListDto) {
    this.logger.log(`Get tag list`);
    const result = await this.queryBus.execute(new TagListQuery(dto));
    return new PaginatedResult<Tag>(result, Tag);
  }

  @Get('related')
  @ApiOperation({ summary: 'Get tags related to the itemssearch' })
  @ApiOkResponse({
    type: PaginatedResult<TagWithRelevance>,
    status: 200,
    description: 'Paginated result of tags',
  })
  async getTagsRelated(@Query() dto: QueryTagRelatedDto) {
    this.logger.log(`Get related tag list`);
    const result = await this.queryBus.execute(new TagRelatedQuery(dto));
    return new PaginatedResult<TagWithRelevance>(result, TagWithRelevance);
  }
}
