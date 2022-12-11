import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventStore } from '../EventstoreModule/eventstore';
import { CommandHandlers } from './commands';
import { EventHandlers } from './events';
import { ItemsCommandsController } from './items.commands.controller';
import { Item } from './models/item.model';
import { Sagas } from './sagas';
@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Item])],
  controllers: [ItemsCommandsController],
  providers: [...CommandHandlers, ...EventHandlers, ...Sagas, EventStore],
})
export class ItemsCommandsModule {}
