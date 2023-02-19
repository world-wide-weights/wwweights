import { InjectModel } from '@m8a/nestjs-typegoose';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { ItemSortEnum } from '../../items/enums/item-sort-enum';
import { Item } from '../../models/item.model';
import { getFilter } from '../../shared/functions/get-filter';
import { getSort } from '../../shared/functions/get-sort';
import { DataWithCount } from '../../shared/interfaces/data-with-count';
import { PaginatedResponse } from '../../shared/interfaces/paginated-result';
import { TagWithRelevance } from '../interfaces/tag-with-relevance';
import { TagRelatedQuery } from './related-tags.query';

@QueryHandler(TagRelatedQuery)
export class TagRelatedHandler implements IQueryHandler<TagRelatedQuery> {
  private readonly logger = new Logger(TagRelatedHandler.name);

  constructor(
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
  ) {}

  async execute({
    dto,
  }: TagRelatedQuery): Promise<PaginatedResponse<TagWithRelevance>> {
    try {
      const filter = getFilter(dto.query, dto.tags);
      const sort = getSort(ItemSortEnum.RELEVANCE, !!dto.query || !!dto.tags);

      // After searching for the normal filter parameters, this aggregation counts the number of items
      // Then it unwinds all tags and counts their occurences
      // After that it filters out all tags that do not build a subset, this automattically strips those from the search aswell
      // Lastly we flatten the result, and then facet to get a total count and the actual paginated data
      const relatedTagsWithCount = await this.itemModel.aggregate<
        DataWithCount<TagWithRelevance>
      >([
        { $match: filter },
        // TODO: Find a fix for @ts-ignore
        // Unfortunately, we need to ignore the following line, because the fields are not known at compile time
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        { $sort: sort },
        { $limit: 1000 },
        {
          $group: {
            _id: 'null',
            tags: { $push: '$tags' },
            size: { $sum: 1 },
          },
        },
        {
          $unwind: {
            path: '$tags',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $unwind: {
            path: '$tags',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $group: {
            _id: '$tags.name',
            count: { $max: '$tags.count' },
            size: { $first: '$size' },
            occurence: { $count: {} },
          },
        },
        { $match: { $expr: { $ne: ['$occurence', '$size'] } } },
        {
          $project: {
            _id: 0,
            name: '$_id',
            count: '$count',
            relevance: {
              $floor: {
                $multiply: [{ $divide: ['$occurence', '$size'] }, 100],
              },
            },
          },
        },
        { $sort: { relevance: -1 } },
        {
          $facet: {
            data: [
              { $skip: (dto.page - 1) * dto.limit },
              { $limit: dto.limit },
            ],
            total: [{ $count: 'count' }],
          },
        },
      ]);

      this.logger.log(
        `Related Tags found: ${relatedTagsWithCount[0].total[0]?.count || 0}`,
      );

      return {
        total: relatedTagsWithCount[0].total[0]?.count || 0,
        page: dto.page,
        limit: dto.limit,
        data: relatedTagsWithCount[0].data,
      };
    } catch (error) /* istanbul ignore next */ {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Related Tags could not be retrieved',
      );
    }
  }
}
