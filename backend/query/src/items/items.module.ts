import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Item } from '../models/item.model';
import { ItemsController } from './items.controller';
import { QueryHandlers } from './queries';

@Module({
  imports: [CqrsModule, TypegooseModule.forFeature([Item])],
  controllers: [ItemsController],
  providers: [...QueryHandlers],
})
export class ItemsModule {}
