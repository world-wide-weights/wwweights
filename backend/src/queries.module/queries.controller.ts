import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Param,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetItemDto } from '../commands.module/interfaces/get-item-dto';
import { GetItemQuery } from './queries/get-item.query';

@Controller('queries')
@ApiTags('queries')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class ItemsQueriesController {
  private readonly logger = new Logger(ItemsQueriesController.name);

  constructor(private queryBus: QueryBus) {}

  @Get('get-one-item/:slug')
  @ApiParam({ name: 'slug', type: String })
  @ApiOperation({ summary: 'Get an item by slug' })
  async getItem(@Param() { slug }: GetItemDto) {
    this.logger.log(`Get item with slug ${slug}`);
    return await this.queryBus.execute(new GetItemQuery(slug));
  }
}
