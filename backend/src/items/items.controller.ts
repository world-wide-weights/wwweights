import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
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
    // just here for Testing since no create issue was created
    @InjectRepository(Item)
    private repository: Repository<Item>,
  ) {}

  @Post()
  @ApiBody({ type: CreateItemDto })
  @ApiOperation({ summary: 'Create an item' })
  async createItem(@Body() createItemDto: CreateItemDto) {
    return this.commandBus.execute(new CreateItemCommand(createItemDto));
    // } catch (error) {
    //   if (error.name === 'QueryFailedError')
    //     throw new UnprocessableEntityException('Item could not be created');
    //   this.logger.error(error);
    // }
  }

  @Get()
  async getAllItems() {
    // TODO: implement
    return await this.repository.find();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Get an item by id' })
  async getItem(@Param() { id }: GetItemDto) {
    this.logger.log(`Get item with id ${id}`);
    // TODO: Serializer works, but how to add "admin" grp
    // TODO: does this and everywhere else have to be awaited?
    return this.queryBus.execute(new GetItemQuery(id));
  }

  @Delete()
  async deleteAllItems() {
    // TODO: implement
    return await this.repository.delete({});
  }

  @Delete('/:id')
  async deleteItem(@Param() { id }: GetItemDto) {
    // TODO: implement
    return await this.repository.delete(id);
  }
}
