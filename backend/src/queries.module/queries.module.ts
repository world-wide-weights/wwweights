import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Item } from '../models/item.model';
import { QueryHandlers } from './queries';
import { QueriesController } from './queries.controller';
@Module({
  imports: [CqrsModule, TypegooseModule.forFeature([Item])],
  controllers: [QueriesController],
  providers: [...QueryHandlers],
})
export class QueriesModule {}
