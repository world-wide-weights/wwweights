import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from '../CommandModule/models/item.model';
import { EventStore } from '../EventstoreModule/eventstore';
import { QueryHandlers } from './queries';
import { ItemsQueriesController } from './queries.controller';
@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Item])],
  controllers: [ItemsQueriesController],
  providers: [...QueryHandlers, EventStore],
})
export class ItemsQueriesModule {}
