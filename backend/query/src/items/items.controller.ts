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
import { Item } from '../models/item.model';
import { PaginatedResult } from './interfaces/paginated-items';
import { QueryItemListDto } from './interfaces/query-item-list.dto';
import { QueryItemRelatedDto } from './interfaces/query-item-related.dto';
import { ItemListQuery } from './queries/item-list.query';
import { ItemRelatedQuery } from './queries/related-items.query';

@Controller()
@ApiTags()
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class ItemsController {
  private readonly logger = new Logger(ItemsController.name);

  constructor(private queryBus: QueryBus) {}

  @Get('items/list')
  @ApiOperation({ summary: 'Get a list of items' })
  async getItemList(@Query() dto: QueryItemListDto) {
    this.logger.log(`Get item list`);
    const result = await this.queryBus.execute(new ItemListQuery(dto));
    return new PaginatedResult<Item>(result, Item);
  }

  @Get('items/related')
  @ApiOperation({ summary: 'Get an item by slug' })
  async getItem(@Query() dto: QueryItemRelatedDto) {
    this.logger.log(`Get item list`);
    const result = await this.queryBus.execute(new ItemRelatedQuery(dto));
    return new PaginatedResult<Item>(result, Item);
  }

  // @Get('items/statistics')
  // @ApiQuery({ name: 'dto', required: false, type: QueryItemStatisticsDto })
  // @ApiOperation({ summary: 'Get an item by slug' })
  // async getItemStatistics(@Query() dto: QueryItemStatisticsDto) {
  //   this.logger.log(`Get item list`);
  //   return await this.queryBus.execute(new GetItemStatisticsQuery(dto));
  // }

  // @Get('tags/list')
  // @ApiQuery({ name: 'dto', required: false, type: QueryTagListDto })
  // @ApiOperation({ summary: 'Get an item by slug' })
  // async getTagsList(@Query() dto: QueryItemListDto) {
  //   this.logger.log(`Get item list`);
  //   return await this.queryBus.execute(new GetTagsListQuery(dto));
  // }

  // @Get('tags/related')
  // @ApiQuery({ name: 'dto', required: false, type: QueryTagRelatedDto })
  // @ApiOperation({ summary: 'Get an item by slug' })
  // async getTagsRelated(@Query() dto: QueryItemListDto) {
  //   this.logger.log(`Get item list`);
  //   return await this.queryBus.execute(new GetTagsRelatedQuery(dto));
  // }
}
