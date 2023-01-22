import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { Item } from '../../models/item.model';
import { getFilter } from '../../shared/get-filter';
import { getSort } from '../../shared/get-sort';
import { ItemListQuery } from './item-list.query';

@QueryHandler(ItemListQuery)
export class ItemListHandler implements IQueryHandler<ItemListQuery> {
  private readonly logger = new Logger(ItemListHandler.name);

  constructor(
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
  ) {}

  async execute({ dto }: ItemListQuery) {
    try {
      // We currently also run textSearch on tags, optimizing via itemsByTags is a TODO
      const sort = getSort(dto.sort, (dto.query || dto.tags) && !dto.slug);
      const filter = getFilter(dto.query, dto.tags, dto.slug);

      // TODO: Query through itemsByTags if tags are listed
      const result = await this.itemModel
        .find(filter, {}, { sort })
        .skip((dto.page - 1) * dto.limit)
        .limit(dto.limit)
        .lean()
        .exec();

      this.logger.log(`Items found:  ${result.length}`);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException(
        'Item list could not be retrieved',
      );
    }
  }
}
