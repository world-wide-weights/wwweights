import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Module } from '@nestjs/common';
import { Item } from '../models/item.model';
import { Tag } from '../models/tag.model';
import { CronJobHandlers } from './cron-handlers';
import { ItemCronJobHandler } from './cron-handlers/items.cron';

@Module({
  imports: [TypegooseModule.forFeature([Item, Tag])],
  providers: [...CronJobHandlers],
  exports: [ItemCronJobHandler],
})
export class CronModule {}
