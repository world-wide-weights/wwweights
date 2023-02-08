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
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedResponse } from '../shared/paginated-result';
import { ItemStatistics } from './interfaces/item-statistics';
import { QueryItemListDto } from './interfaces/query-item-list.dto';
import { QueryItemRelatedDto } from './interfaces/query-item-related.dto';
import { QueryItemStatisticsDto } from './interfaces/query-item-statistics.dto';
import { Item } from './models/item.model';
import { ItemListQuery } from './queries/item-list.query';
import { ItemStatisticsQuery } from './queries/item-statistics.query';
import { ItemRelatedQuery } from './queries/related-items.query';

@Controller('items')
@ApiTags('items')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class ItemsController {
  private readonly logger = new Logger(ItemsController.name);

  constructor(private queryBus: QueryBus) {}

  @Get('list')
  @ApiOperation({ summary: 'Get a list of items' })
  @ApiOkResponse({
    description: 'Paginated result of items',
    type: PaginatedResponse<Item>,
  })
  async getItemList(@Query() dto: QueryItemListDto) {
    this.logger.log(`Get item list`);
    const result = await this.queryBus.execute(new ItemListQuery(dto));
    return new PaginatedResponse<Item>(result, Item);
  }

  @Get('related')
  @ApiOperation({ summary: 'Get related items' })
  @ApiOkResponse({
    description: 'Paginated result of related items',
    type: PaginatedResponse<Item>,
  })
  @ApiNotFoundResponse({ description: 'The item could not be found' })
  async getItem(@Query() dto: QueryItemRelatedDto) {
    this.logger.log(`Get item list`);
    const result = await this.queryBus.execute(new ItemRelatedQuery(dto));
    return new PaginatedResponse<Item>(result, Item);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get statistics' })
  @ApiNotFoundResponse({ description: 'No items found' })
  @ApiOkResponse({ description: 'Item statistics', type: ItemStatistics })
  async getItemStatistics(@Query() dto: QueryItemStatisticsDto) {
    this.logger.log(`Get item list`);
    const result = await this.queryBus.execute(new ItemStatisticsQuery(dto));
    return new ItemStatistics(result);
  }
}
