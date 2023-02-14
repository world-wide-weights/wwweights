import { InjectModel } from '@m8a/nestjs-typegoose';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReturnModelType } from '@typegoose/typegoose';
import { EditSuggestion } from './models/edit-suggestion.model';
import { Item } from './models/item.model';
import { GlobalStatistics } from './shared/interfaces/global-statistics';

@Controller()
@ApiTags('app')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
    @InjectModel(EditSuggestion)
    private readonly editSuggestionModel: ReturnModelType<
      typeof EditSuggestion
    >,
  ) {}

  @Get('statistics')
  @ApiOperation({ summary: 'Get global statistics' })
  @ApiOkResponse({
    type: GlobalStatistics,
    description: `Global statistics, the totalContribution ignores hard deleted items 
      We can argue that 1 item creation + 1 item deletion = 1 falsy contribution`,
  })
  // TODO: Debate if this should use the eventStoreConnection to get more accurate counts, for example if approved edit suggestions get deleted
  async getGlobalStatistics() {
    this.logger.log(`Get global statistics`);
    // TODO: Add filter if items can be softdeleted
    const totalItems = await this.itemModel.count().exec();
    const totalEditContributions = await this.editSuggestionModel
      .count()
      .exec();
    // TODO: Add Delete Contributions
    return new GlobalStatistics(totalItems, totalEditContributions);
  }
}
