import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ItemCronJobHandler } from '../cron/cron-handlers/items.cron';
import { CronModule } from '../cron/cron.module';
import { Item } from '../models/item.model';
import { Tag } from '../models/tag.model';
import { ItemsController } from './controllers/items.controller';
import { ItemsService } from './services/item.service';

@Module({
  imports: [CqrsModule, CronModule, TypegooseModule.forFeature([Item, Tag])],
  providers: [ItemsService, ItemCronJobHandler],
  controllers: [ItemsController],
})
export class ControllersModule {}
