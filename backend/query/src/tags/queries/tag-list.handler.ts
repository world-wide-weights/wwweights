import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { TagSortEnum } from '../interfaces/tag-sort-enum';
import { Tag } from '../models/tag.model';
import { TagListQuery } from './tag-list.query';

@QueryHandler(TagListQuery)
export class TagListHandler implements IQueryHandler<TagListQuery> {
  private readonly logger = new Logger(TagListHandler.name);

  constructor(
    @InjectModel(Tag)
    private readonly tagModel: ReturnModelType<typeof Tag>,
  ) {}

  async execute({ dto }: TagListQuery) {
    try {
      const sort: { name: number } | { count: -1 } =
        dto.sort === TagSortEnum.DESC
          ? { name: -1 }
          : dto.sort === TagSortEnum.MOST_USED
          ? { count: -1 }
          : { name: 1 };
      const tagCount = await this.tagModel.count();
      const tagList = await this.tagModel
        .find<Tag>()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        .sort(sort)
        .select({ _id: 0 })
        .skip((dto.page - 1) * dto.limit)
        .limit(dto.limit)
        .exec();

      this.logger.log(`Tags found:  ${tagCount}`);

      this.logger.debug(tagList);
      return {
        total: tagCount,
        page: dto.page,
        limit: dto.limit,
        data: tagList,
      };
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException('Tag list could not be retrieved');
    }
  }
}
