import { InjectModel } from '@m8a/nestjs-typegoose';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { Tag } from '../../models/tag.model';
import { DataWithCount } from '../../shared/interfaces/data-with-count.interface';
import { PaginatedResponse } from '../../shared/interfaces/paginated-result.interface';
import { TagSortEnum } from '../interfaces/tag-sort-enum';
import { TagListQuery } from './tag-list.query';

@QueryHandler(TagListQuery)
export class TagListHandler implements IQueryHandler<TagListQuery> {
  private readonly logger = new Logger(TagListHandler.name);

  constructor(
    @InjectModel(Tag)
    private readonly tagModel: ReturnModelType<typeof Tag>,
  ) {}

  async execute({ dto }: TagListQuery): Promise<PaginatedResponse<Tag>> {
    try {
      const sort: { name: number } | { count: -1 } =
        dto.sort === TagSortEnum.DESC
          ? { name: -1 }
          : dto.sort === TagSortEnum.MOST_USED
          ? { count: -1 }
          : { name: 1 };

      const tagListWithCount = await this.tagModel.aggregate<
        DataWithCount<Tag>
      >([
        // TODO: Find a fix for @ts-ignore
        // Unfortunately, we need to ignore the following line, because the fields are not known at compile time
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        { $sort: sort },
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
        `Tags found: ${tagListWithCount[0].total[0]?.count || 0}`,
      );

      return {
        total: tagListWithCount[0].total[0]?.count || 0,
        page: dto.page,
        limit: dto.limit,
        data: tagListWithCount[0].data,
      };
    } catch (error) /* istanbul ignore next */ {
      this.logger.error(error);
      throw new InternalServerErrorException('Tag list could not be retrieved');
    }
  }
}
