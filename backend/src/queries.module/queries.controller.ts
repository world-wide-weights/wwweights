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
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryItemListDto } from './interfaces/query-item-list.dto';
import { QueryItemRelatedDto } from './interfaces/query-item-related.dto';
import { QueryItemStatisticsDto } from './interfaces/query-item-statistics.dto';
import { QueryTagListDto } from './interfaces/query-tag-list.dto';
import { QueryTagRelatedDto } from './interfaces/query-tag-related.dto';
import { GetItemQuery } from './queries/get-item-list.query';

@Controller('query/v1')
@ApiTags('query/v1')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class QueriesController {
  private readonly logger = new Logger(QueriesController.name);

  constructor(private queryBus: QueryBus) {}

  @Get('items/list')
  @ApiQuery({ name: 'dto', required: false, type: QueryItemListDto })
  @ApiOperation({ summary: 'Get an item by slug' })
  async getItemList(@Query() dto: QueryItemListDto) {
    this.logger.log(`Get item list`);
    return await this.queryBus.execute(new GetItemQuery(dto));
  }

  @Get('items/related')
  @ApiQuery({ name: 'dto', required: false, type: QueryItemRelatedDto })
  @ApiOperation({ summary: 'Get an item by slug' })
  async getItem(@Query() dto: QueryItemRelatedDto) {
    this.logger.log(`Get item list`);
    return await this.queryBus.execute(new GetItemQuery(dto));
  }

  @Get('items/statistics')
  @ApiQuery({ name: 'dto', required: false, type: QueryItemStatisticsDto })
  @ApiOperation({ summary: 'Get an item by slug' })
  async getItemStatistics(@Query() dto: QueryItemStatisticsDto) {
    this.logger.log(`Get item list`);
    return await this.queryBus.execute(new GetItemQuery(dto));
  }

  @Get('tags/list')
  @ApiQuery({ name: 'dto', required: false, type: QueryTagListDto })
  @ApiOperation({ summary: 'Get an item by slug' })
  async getTagsList(@Query() dto: QueryItemListDto) {
    this.logger.log(`Get item list`);
    return await this.queryBus.execute(new GetItemQuery(dto));
  }

  @Get('tags/related')
  @ApiQuery({ name: 'dto', required: false, type: QueryTagRelatedDto })
  @ApiOperation({ summary: 'Get an item by slug' })
  async getTagsRelated(@Query() dto: QueryItemListDto) {
    this.logger.log(`Get item list`);
    return await this.queryBus.execute(new GetItemQuery(dto));
  }
}
