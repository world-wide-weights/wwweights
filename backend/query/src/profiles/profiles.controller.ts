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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { QueryProfileStatisticsDto } from './dtos/query-profile-statistics.dto';
import { ProfileStatistics } from './interfaces/profile-statistics-response.interface';
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
    type: ProfileStatistics,
    description: 'Counts of profile activity',
  })
  @ApiNotFoundResponse({ description: 'Profile not found' })
  async getProfileStatistics(@Param() dto: QueryProfileStatisticsDto) {
    this.logger.log(`Get profileCounts for ${dto.userId}`);
    const result = await this.queryBus.execute(new ProfileStatisticsQuery(dto));
    return new ProfileStatistics(result);
  }
}
