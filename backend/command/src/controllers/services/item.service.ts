import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BulkInsertItemDTO } from '../dtos/bulk-insert-item.dto';
import { InsertItemCommand } from '../../commands/item-commands/insert-item.command';
import { ItemCronJobHandler } from '../../cron/cron-handlers/items.cron';

@Injectable()
export class ItemsService {
  private readonly logger = new Logger(ItemsService.name);
  constructor(
    private commandBus: CommandBus,
    private itemCronJobHandler: ItemCronJobHandler,
  ) {}

  /**
   * @description Create multiple item insert commands on the commandsbus. Due to many inserts, also trigger cronjob
   */
  async handleBulkInsert(
    bulkInsertItemDTOs: BulkInsertItemDTO[],
  ): Promise<void> {
    let count = 0;
    try {
      for (const itemInsertDTO of bulkInsertItemDTOs) {
        const { userId, ...itemData } = itemInsertDTO;
        // Use userId 0 for admin inserts
        await this.commandBus.execute(
          new InsertItemCommand(itemData, userId || 0),
        );
        count++;
      }
    } catch (error) {
      this.logger.error(
        `Failed bulk insert at ${count}/${bulkInsertItemDTOs.length} items due to an error: ${error}`,
      );
      // Pass unsanitized as this is only available in dev environments
      throw new InternalServerErrorException(error);
    }
    this.logger.log(`Bulk insert was a success for ${count} items`);
    // Dont await as these are meant to be running in the background
    this.itemCronJobHandler.correctAllItemTagCounts();
    this.logger.log(`Post bulk insert cronjobs have been triggered`);
  }
}
