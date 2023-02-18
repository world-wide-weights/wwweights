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

  /**
   * @description Increment the persisted counter for items
   */
  async incrementGlobalItemCount(): Promise<void> {
    await this.globalStatisticsModel.updateOne(
      {},
      { $inc: { totalItems: 1 } },
      { upsert: true },
    );
    this.logger.log('Incremented global item count');
  }

  /**
   * @description Decrement the persisted counter for items
   */
  async decrementGlobalItemCount(): Promise<void> {
    await this.globalStatisticsModel.updateOne(
      {},
      { $inc: { totalItems: -1 } },
    );
    this.logger.log('Decremented global item count');
  }

  /**
   * @description Increment the persisted counter for suggestions
   */
  async incrementGlobalSuggestionCount(): Promise<void> {
    await this.globalStatisticsModel.updateOne(
      {},
      { $inc: { totalSuggestions: 1 } },
    );
    this.logger.log('Incremented global suggestion count');
  }
}
