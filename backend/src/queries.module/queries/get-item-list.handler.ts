import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../../models/item.model';
import { GetItemListQuery } from './get-item-list.query';

@QueryHandler(GetItemListQuery)
export class GetItemListHandler implements IQueryHandler<GetItemListQuery> {
  private readonly logger = new Logger(GetItemListHandler.name);

  constructor(
    @InjectRepository(Item)
    private repository: Repository<Item>,
  ) {}

  async execute({ dto }: GetItemListQuery) {
    const result = await this.repository.find({
      skip: dto.page * dto.limit,
      take: dto.limit,
      order: dto.sort === 'relevance' ? undefined : { [dto.sort]: 'ASC' },
    });
    return result;
  }
}
