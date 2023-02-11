import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Param,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  PickType,
} from '@nestjs/swagger';
import { ProfileStatistics } from './interfaces/profile-statistics-response';
import { QueryProfileStatisticsDto } from './interfaces/query-profile-statistics.dto';
import { Profile } from './models/profile.model';
import { ProfileStatisticsQuery } from './queries/profile-statistics.query';

@Controller('profiles')
@ApiTags('profiles')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class ProfilesController {
  private readonly logger = new Logger(ProfilesController.name);

  constructor(private queryBus: QueryBus) {}

  @Get(':userId/statistics')
  @ApiOperation({ summary: 'Get profile counts' })
  @ApiOkResponse({
    type: PickType(Profile, ['count']),
    description: 'Counts of profile activity',
  })
  async getProfileStatistics(@Param() dto: QueryProfileStatisticsDto) {
    this.logger.log(`Get profileCounts for ${dto.userId}`);
    const result = await this.queryBus.execute(new ProfileStatisticsQuery(dto));
    return new ProfileStatistics(result);
  }
}
