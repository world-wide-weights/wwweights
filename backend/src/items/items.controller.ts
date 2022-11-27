import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemCommand } from './commands/impl/create-item.command';
import { CreateItemDto } from './interfaces/create-item.dto';
import { GetItemDto } from './interfaces/get-item-dto';
import { Item } from './models/item.model';
import { GetItemQuery } from './queries/impl';

@Controller('items')
@ApiTags('items')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class ItemsController {
  private readonly logger = new Logger(ItemsController.name);

  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    // TODO: remove after implementations
    @InjectRepository(Item)
    private repository: Repository<Item>,
  ) {}

  @Post()
  @ApiBody({ type: CreateItemDto })
  @ApiOperation({ summary: 'Create an item' })
  async createItem(@Body() createItemDto: CreateItemDto) {
    return this.commandBus.execute(new CreateItemCommand(createItemDto));
  }

  @Get()
  async getAllItems() {
    // TODO: implement in other issue
    return await this.repository.find();
  }

  @Get(':slug')
  @ApiParam({ name: 'slug', type: String })
  @ApiOperation({ summary: 'Get an item by id' })
  async getItem(@Param() { slug }: GetItemDto) {
    this.logger.log(`Get item with slug ${slug}`);
    return await this.queryBus.execute(new GetItemQuery(slug));
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllItems() {
    // TODO: do not implement, we use event sourcing and ddd, so we do not delete
    return await this.repository.delete({});
  }

  @Delete('/:slug')
  async deleteItem(@Param() { slug }: GetItemDto) {
    // TODO: do not implement, we use event sourcing and ddd, so we do not delete
    return await this.repository.delete(slug);
  }
}
