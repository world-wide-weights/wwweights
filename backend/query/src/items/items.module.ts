import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ItemsByTag } from '../models/items-by-tag.model';
import { Profile } from '../models/profile.model';
import { Suggestion } from '../models/suggestion.model';
import { Tag } from '../tags/models/tag.model';
import { ItemsController } from './items.controller';
import { Item } from './models/item.model';
import { QueryHandlers } from './queries';
@Module({
  imports: [
    CqrsModule,
    TypegooseModule.forFeature([Item, ItemsByTag, Tag, Suggestion, Profile]),
  ],
  controllers: [ItemsController],
  providers: [...QueryHandlers],
})
export class ItemsModule {}
