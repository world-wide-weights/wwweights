import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../models/item.model';
import { CreateItemCommand } from './commands/create-item.command';
import { CreateItemDto } from './interfaces/create-item.dto';
import { GetItemDto } from './interfaces/get-item-dto';

@Controller('commands')
@ApiTags('commands')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class ItemsCommandsController {
  private readonly logger = new Logger(ItemsCommandsController.name);

  constructor(
    private commandBus: CommandBus,
    // TODO: remove after implementations
    @InjectRepository(Item)
    private repository: Repository<Item>,
  ) {}

  @Post('create-item')
  @ApiBody({ type: CreateItemDto })
  @ApiOperation({ summary: 'Create an item' })
  @HttpCode(HttpStatus.OK)
  async createItem(@Body() createItemDto: CreateItemDto) {
    this.commandBus.execute(new CreateItemCommand(createItemDto));
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
