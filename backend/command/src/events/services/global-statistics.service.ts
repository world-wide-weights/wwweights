import { InjectModel } from '@m8a/nestjs-typegoose';
import { Injectable, Logger } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { GlobalStatistics } from '../../models/global-statistics.model';

@Injectable()
export class GlobalStatisticsService {
  private readonly logger = new Logger(GlobalStatisticsService.name);

  constructor(
    @InjectModel(GlobalStatistics)
    private readonly globalStatisticsModel: ReturnModelType<
      typeof GlobalStatistics
    >,
  ) {}

  async incrementGlobalItemCount() {
    await this.globalStatisticsModel.updateOne(
      {},
      { $inc: { totalItems: 1 } },
      { upsert: true },
    );
    this.logger.log('Incremented global item count');
  }

  async decrementGlobalItemCount() {
    await this.globalStatisticsModel.updateOne(
      {},
      { $inc: { totalItems: -1 } },
    );
    this.logger.log('Decremented global item count');
  }

  async incrementGlobalSuggestionCount() {
    await this.globalStatisticsModel.updateOne(
      {},
      { $inc: { totalSuggestions: 1 } },
    );
    this.logger.log('Incremented global suggestion count');
  }
}
