import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  UnprocessableEntityException,
  UseInterceptors,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetItemDto } from './interfaces/get-item-dto';
import { Item } from './models/item.model';
import { GetItemQuery } from './queries/impl';

@Controller('items')
@ApiTags('items')
@UseInterceptors(ClassSerializerInterceptor)
export class ItemsController {
  private readonly logger = new Logger(ItemsController.name);

  constructor(
    private queryBus: QueryBus,
    // just here for Testing since no create issue was created
    @InjectRepository(Item)
    private repository: Repository<Item>,
  ) {}

  @Post()
  async createItem() {
    // This is currently jsut for testing since it is not part of any issue
    try {
      const newItem = new Item({
        name: 'test Name with SpAcEs ',
        value: '1kg',
        is_ca: true,
        tags: ['testTag', 'testTag2'],
        user: 'testUser',
        isActive: true,
      });
      newItem.applySlug();
      return await this.repository.save(newItem);
    } catch (error) {
      if (error.name === 'QueryFailedError')
        throw new UnprocessableEntityException('Item already exists');
      this.logger.error(error);
    }
  }

  @Get()
  findAllItems() {
    return 'This action returns all items';
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Get an item by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found item',
    type: Item,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No item found',
    type: null,
  })
  async getItem(@Param() { id }: GetItemDto) {
    this.logger.log(`Get item with id ${id}`);
    // TODO: Serializer works, but how to add "admin" grp
    return this.queryBus.execute(new GetItemQuery(id));
  }
}
