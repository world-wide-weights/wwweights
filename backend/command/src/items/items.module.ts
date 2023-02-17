import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventStoreModule } from '../eventstore/eventstore.module';
import { DeleteSuggestion } from '../models/delete-suggestion.model';
import { EditSuggestion } from '../models/edit-suggestion.model';
import { Item } from '../models/item.model';
import { Profile } from '../models/profile.model';
import { Tag } from '../models/tag.model';
import { SharedModule } from '../shared/shared.module';
import { CommandHandlers } from './commands';
import { ItemCronJobHandler } from './cron/items.cron';
import { EventHandlers } from './events';
import { ItemsController } from './items.controller';
import { Sagas } from './sagas';
import { ItemsService } from './services/item.service';
@Module({
  imports: [
    CqrsModule,
    SharedModule,
    TypegooseModule.forFeature([
      Item,
      Tag,
      EditSuggestion,
      DeleteSuggestion,
      Profile,
    ]),
    EventStoreModule,
  ],
  controllers: [ItemsController],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
    ...Sagas,
    ItemCronJobHandler,
    ItemsService,
  ],
})
export class ItemsModule {}
