import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetItemDto } from './interfaces/get-item-dto';
import { Item } from './models/item.model';
import { GetItemQuery } from './queries/impl';

@Controller('items')
@ApiTags('items')
@UseInterceptors(ClassSerializerInterceptor)
export class ItemsController {
  constructor(
    private queryBus: QueryBus,
    // just here for Testing since no create issue was created
    @InjectRepository(Item)
    private repository: Repository<Item>,
  ) {}

  @Post()
  createItem() {
    // This is currently jsut for testing since it is not part of any issue
    const newItem = new Item({
      name: 'test Name with SpAcEs ',
      weight: 'ca. 1kg',
      tags: ['testTag', 'testTag2'],
      user: 'testUser',
      isActive: true,
    });
    newItem.createSlug();
    return this.repository.save(newItem);
  }

  @Get()
  findAllItems() {
    return 'This action returns all items';
  }

  @Get(':id')
  async getItem(@Param() { id }: GetItemDto) {
    return this.queryBus.execute(new GetItemQuery(id)); // TODO Check if this i converted to Number with dto and Serializer
  }
}
