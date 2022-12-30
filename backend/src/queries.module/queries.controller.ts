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
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { QueryItemListDto } from './interfaces/query-item-list.dto';
import { GetItemQuery } from './queries/get-item.query';

@Controller('query/v1')
@ApiTags('query/v1')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class QueriesController {
  private readonly logger = new Logger(QueriesController.name);

  constructor(private queryBus: QueryBus) {}

  @Get('list')
  @ApiParam({ name: 'slug', type: String })
  @ApiOperation({ summary: 'Get an item by slug' })
  async getItem(@Query() { slug }: QueryItemListDto) {
    this.logger.log(`Get item with slug ${slug}`);
    return await this.queryBus.execute(new GetItemQuery(slug));
  }
}
