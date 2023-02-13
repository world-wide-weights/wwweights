import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InsertItemCommand } from '../commands/insert-item.command';
import { ItemCronJobHandler } from '../cron/items.cron';
import { BulkInsertItemDTO } from '../interfaces/bulk-insert-item.dto';

@Injectable()
export class ItemsService {
  private readonly logger = new Logger(ItemsService.name);
  constructor(
    private commandBus: CommandBus,
    private itemCronJobHandler: ItemCronJobHandler,
  ) {}

  async handleBulkInsert(bulkItemInsertDTO: BulkInsertItemDTO[]) {
    let count = 0;
    try {
      for (const itemInsertDTO of bulkItemInsertDTO) {
        const { userId, ...itemData } = itemInsertDTO;
        // Use userId 0 for admin inserts
        await this.commandBus.execute(
          new InsertItemCommand(itemData, userId || 0),
        );
        count++;
      }
    } catch (error) {
      this.logger.error(
        `Failed bulk insert at ${count}/${bulkItemInsertDTO.length} items due to an error: ${error}`,
      );
      // Pass unsanitized as this is only available in dev environments
      throw new InternalServerErrorException(error);
    }
    this.logger.log(`Bulk insert was success for ${count} items`);
    // Dont await as these are meant to be running in the background
    this.itemCronJobHandler.correctAllItemTagCounts();
    this.itemCronJobHandler.correctAllItemsByTagCounts();
    this.logger.log(`Post bulk insert cronjobs have been triggered`);
  }
}
