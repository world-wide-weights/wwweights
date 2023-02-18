import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventStoreModule } from '../eventstore/eventstore.module';
import { InternalCommunicationModule } from '../internal-communication/internal-communication.module';
import { DeleteSuggestion } from '../models/delete-suggestion.model';
import { EditSuggestion } from '../models/edit-suggestion.model';
import { GlobalStatistics } from '../models/global-statistics.model';
import { Item } from '../models/item.model';
import { Profile } from '../models/profile.model';
import { Tag } from '../models/tag.model';
import { ItemEventHandlers } from './item-events';
import { EventServices } from './services';

@Module({
  imports: [
    CqrsModule,
    TypegooseModule.forFeature([
      Item,
      EditSuggestion,
      DeleteSuggestion,
      GlobalStatistics,
      Profile,
      Tag,
    ]),
    EventStoreModule,
    InternalCommunicationModule,
  ],
  providers: [...ItemEventHandlers, ...EventServices],
})
export class EventsModule {}
