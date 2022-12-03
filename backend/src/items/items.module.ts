import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './commands';
import { EventHandlers } from './events';
import { ItemsController } from './items.controller';
import { Item } from './models/item.model';
import { QueryHandlers } from './queries';
import { ItemsSagas } from './sagas/items.sagas';
@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Item])],
  controllers: [ItemsController],
  providers: [
    ...QueryHandlers,
    ...CommandHandlers,
    ...EventHandlers,
    ItemsSagas,
  ],
})
export class ItemsModule {}
