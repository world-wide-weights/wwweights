import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { CreateItemDto } from './dto/create-item.dto';
import { GetItemDto } from './interfaces/get-item-dto';
import { GetItemQuery } from './queries/impl';

@Controller('items')
@ApiTags('items')
@UseInterceptors(ClassSerializerInterceptor)
export class ItemsController {
  constructor(private queryBus: QueryBus) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return 'This action adds a new item';
  }

  @Get()
  findAll() {
    return 'This action returns all items';
  }

  @Get(':id')
  async getItem(@Param() { id }: GetItemDto) {
    return this.queryBus.execute(new GetItemQuery(id)); // TODO Check if this i converted to Number with dto and Serializer
  }
}
