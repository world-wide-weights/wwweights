import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventStoreModule } from '../eventstore/eventstore.module';
import { ItemsByTag } from '../models/item-by-tag.model';
import { Item } from '../models/item.model';
import { ItemsByTag } from '../models/items-by-tag.model';
import { Profile } from '../models/profile.model';
import { Suggestion } from '../models/suggestion.model';
import { Tag } from '../models/tag.model';
import { CommandHandlers } from './commands';
import { CommandsController } from './commands.controller';
import { EventHandlers } from './events';
import { Sagas } from './sagas';
@Module({
  imports: [
    CqrsModule,
    TypegooseModule.forFeature([Item, ItemsByTag, Tag, Suggestion, Profile]),
    EventStoreModule,
  ],
  controllers: [CommandsController],
  providers: [...CommandHandlers, ...EventHandlers, ...Sagas],
})
export class CommandsModule {}
