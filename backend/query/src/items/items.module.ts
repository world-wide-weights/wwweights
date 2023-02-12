import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Profile } from '../profiles/models/profile.model';
import { Tag } from '../tags/models/tag.model';
import { ItemsController } from './items.controller';
import { Item } from './models/item.model';
import { QueryHandlers } from './queries';

@Module({
  imports: [CqrsModule, TypegooseModule.forFeature([Item, Tag, Profile])],
  controllers: [ItemsController],
  providers: [...QueryHandlers],
})
export class ItemsModule {}
