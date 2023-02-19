import { InjectModel } from '@m8a/nestjs-typegoose';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReturnModelType } from '@typegoose/typegoose';
import { GlobalStatistics } from './models/global-statistics.model';

@Controller()
@ApiTags('app')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AppController {
  constructor(
    @InjectModel(GlobalStatistics)
    private readonly globalStatisticsModel: ReturnModelType<
      typeof GlobalStatistics
    >,
  ) {}

  @Get('statistics')
  @ApiOperation({ summary: 'Get global statistics' })
  @ApiOkResponse({
    type: GlobalStatistics,
    description: `Global statistics`,
  })
  async getGlobalStatistics(): Promise<GlobalStatistics> {
    const globalStatisctics = await this.globalStatisticsModel.findOne().lean();
    return new GlobalStatistics(globalStatisctics);
  }
}
