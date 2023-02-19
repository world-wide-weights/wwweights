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
import { Item } from '../models/item.model';
import { ApiOkResponsePaginated } from '../shared/decorators/paginated-ok-response.decorator';
import { PaginatedResponse } from '../shared/interfaces/paginated-result.interface';
import { QueryItemListDto } from './dtos/query-item-list.dto';
import { QueryItemRelatedDto } from './dtos/query-item-related.dto';
import { QueryItemStatisticsDto } from './dtos/query-item-statistics.dto';
import { ItemStatistics } from './interfaces/item-statistics.interface';
import { ItemListQuery } from './queries/item-list.query';
import { ItemRelatedQuery } from './queries/item-related.query';
import { ItemStatisticsQuery } from './queries/item-statistics.query';

@Controller('items')
@ApiTags('items')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class ItemsController {
  private readonly logger = new Logger(ItemsController.name);

  constructor(private readonly queryBus: QueryBus) {}

  @Get('list')
  @ApiOperation({ summary: 'Get a list of items' })
  @ApiOkResponsePaginated(Item)
  async getItemList(
    @Query() dto: QueryItemListDto,
  ): Promise<PaginatedResponse<Item>> {
    this.logger.log(`Get item list`);
    const result = await this.queryBus.execute(new ItemListQuery(dto));
    return new PaginatedResponse<Item>(result, Item);
  }

  @Get('related')
  @ApiOperation({ summary: 'Get related items' })
  @ApiOkResponsePaginated(Item)
  @ApiNotFoundResponse({ description: 'The item could not be found' })
  async getItemRelated(
    @Query() dto: QueryItemRelatedDto,
  ): Promise<PaginatedResponse<Item>> {
    this.logger.log(`Get related item list`);
    const result = await this.queryBus.execute(new ItemRelatedQuery(dto));
    return new PaginatedResponse<Item>(result, Item);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get statistics for an item search' })
  @ApiNotFoundResponse({ description: 'No items found' })
  @ApiOkResponse({ description: 'Item statistics', type: ItemStatistics })
  async getItemStatistics(
    @Query() dto: QueryItemStatisticsDto,
  ): Promise<ItemStatistics> {
    this.logger.log(`Get item statistics`);
    const result = await this.queryBus.execute(new ItemStatisticsQuery(dto));
    return new ItemStatistics(result);
  }
}
