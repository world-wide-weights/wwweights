import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventStoreModule } from '../eventstore/eventstore.module';
import { Item } from '../models/item.model';
import { ItemsByTag } from '../models/items-by-tag.model';
import { Profile } from '../models/profile.model';
import { Suggestion } from '../models/suggestion.model';
import { Tag } from '../models/tag.model';
import { CommandHandlers } from './commands';
import { ItemCronJobHandler } from './cron/items.cron';
import { EventHandlers } from './events';
import { ItemsController } from './items.controller';
import { Sagas } from './sagas';
@Module({
  imports: [
    CqrsModule,
    TypegooseModule.forFeature([Item, ItemsByTag, Tag, Suggestion, Profile]),
    EventStoreModule,
  ],
  controllers: [ItemsController],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
    ...Sagas,
    ItemCronJobHandler,
  ],
})
export class ItemsModule {}
