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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginatedResult } from '../shared/paginated-result';
import { QueryTagListDto } from './interfaces/query-tag-list.dto';
import { Tag } from './models/tag.model';
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
  async getTagsList(@Query() dto: QueryTagListDto) {
    this.logger.log(`Get tag list`);
    const result = await this.queryBus.execute(new TagListQuery(dto));
    this.logger.debug(result);
    return new PaginatedResult<Tag>(result, Tag);
  }

  // @Get('tags/related')
  // @ApiQuery({ name: 'dto', required: false, type: QueryTagRelatedDto })
  // @ApiOperation({ summary: 'Get an tag by slug' })
  // async getTagsRelated(@Query() dto: QueryItemListDto) {
  //   this.logger.log(`Get tag list`);
  //   return await this.queryBus.execute(new GetTagsRelatedQuery(dto));
  // }
}
