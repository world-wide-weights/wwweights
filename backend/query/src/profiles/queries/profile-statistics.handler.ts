import { InjectModel } from '@m8a/nestjs-typegoose';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { Profile, ProfileCounts } from '../../models/profile.model';
import { ProfileStatisticsQuery } from './profile-statistics.query';

@QueryHandler(ProfileStatisticsQuery)
export class ProfileStatisticsHandler
  implements IQueryHandler<ProfileStatisticsQuery>
{
  private readonly logger = new Logger(ProfileStatisticsHandler.name);

  constructor(
    @InjectModel(Profile)
    private readonly profileModel: ReturnModelType<typeof Profile>,
  ) {}

  async execute({
    userId,
  }: ProfileStatisticsQuery): Promise<
    { count: ProfileCounts } | Record<string, never>
  > {
    const profileStatisticsQueryStartTime = performance.now();

    try {
      const profileCounts = await this.profileModel
        .findOne({ userId: userId }, { _id: 0, count: 1 })
        .lean();
      this.logger.log(`ProfileCounts retrieved for: ${userId}`);

      this.logger.debug(
        `Finished in ${performance.now() - profileStatisticsQueryStartTime} ms`,
      );
      return profileCounts || {};
    } catch (error) /* istanbul ignore next */ {
      this.logger.debug(
        `Failed after ${
          performance.now() - profileStatisticsQueryStartTime
        } ms`,
      );
      this.logger.error(error);
      /* istanbul ignore next */
      throw new InternalServerErrorException(
        'Profile statistics could not be retrieved',
      );
    }
  }
}
