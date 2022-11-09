import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../../models/item.model';
import { GetItemQuery } from '../impl';

@QueryHandler(GetItemQuery)
export class GetItemHandler implements IQueryHandler<GetItemQuery> {
  constructor(
    @InjectRepository(Item)
    private repository: Repository<Item>,
  ) {}

  async execute(query: GetItemQuery) {
    return this.repository.findOneBy(query);
  }
}
