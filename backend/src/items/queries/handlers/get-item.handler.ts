import { NotFoundException } from '@nestjs/common';
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
    const result = await this.repository.findOneBy(query);
    if (!result)
      throw new NotFoundException(`Item with slug ${query.slug} not found`);

    // TODO: Can you return new ...Exception... and it throws it later? => return result || new NotFoundException(`Item with id ${query.id} not found`);
    return result;
  }
}
