import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { DataWithCount } from '../../items/interfaces/counted-items';
import { ItemsByTag } from '../../models/items-by-tag.model';
import { Tag } from '../models/tag.model';
import { TagRelatedQuery } from './related-tags.query';

@QueryHandler(TagRelatedQuery)
export class TagRelatedHandler implements IQueryHandler<TagRelatedQuery> {
  private readonly logger = new Logger(TagRelatedHandler.name);

  constructor(
    @InjectModel(ItemsByTag)
    private readonly itemsByTagModel: ReturnModelType<typeof ItemsByTag>,
  ) {}

  async execute({ dto }: TagRelatedQuery) {
    try {
      // This aggregates looks at all the items that have the looked for tag via the itemsByTag collection
      // and then counts the occurences of all the tags in all the items,
      // sorts them by it and returns total count and paginated Tags
      const relatedTagsWithCount = await this.itemsByTagModel.aggregate<
        DataWithCount<Tag>
      >([
        { $match: { tagName: 'android' } },
        // Reduce to get all the tags in all the items in one array
        {
          $addFields: {
            relatedTags: {
              $reduce: {
                input: '$items.tags',
                initialValue: [],
                in: { $concatArrays: ['$$value', '$$this'] },
              },
            },
          },
        },
        {
          $unwind: {
            path: '$relatedTags',
            preserveNullAndEmptyArrays: false,
          },
        },
        // Remove the overheads and flatten the object to more easily group them
        {
          $project: {
            _id: 0,
            name: '$relatedTags.name',
            count: '$relatedTags.count',
          },
        },
        {
          $group: {
            _id: '$name',
            count: { $first: '$count' },
            occurence: { $count: {} },
          },
        },
        { $sort: { count: -1 } },
        {
          $facet: {
            total: [{ $count: 'count' }],
            data: [
              { $skip: (dto.page - 1) * dto.limit },
              { $limit: dto.limit },
              { $project: { occurence: 0, name: '$_id', _id: 0 } },
            ],
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
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException(
        'Searching for this slug caused an error',
      );
    }
  }
}

// Some thoughts:
/*
[
  {
    '$match': {
      '$and': [
        {
          '$text': {
            '$search': 'android replacethis'
          }
        }, {
          'tags.name': {
            '$all': [
              'android', 'smartphone'
            ]
          }
        }
      ]
    }
  }, {
    '$unwind': {
      'path': '$tags', 
      'preserveNullAndEmptyArrays': false
    }
  }, {
    '$project': {
      '_id': 0, 
      'name': '$tags.name', 
      'count': '$tags.count'
    }
  }, {
    '$group': {
      '_id': '$name', 
      'count': {
        '$max': '$count'
      }, 
      'occurence': {
        '$count': {}
      }
    }
  }, {
    '$sort': {
      'occurence': -1, 
      'percent': -1
    }
  }, {
    '$match': {
      '_id': {
        '$nin': [
          1000000000000000000000
        ]
      }
    }
  }, {
    '$facet': {
      'total': [
        {
          '$count': 'count'
        }
      ], 
      'data': [
        {}
      ]
    }
  }
]
*/
