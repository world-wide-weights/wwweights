import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventStore } from '../eventstore/eventstore';
import { Item } from '../models/item.model';
import { CommandHandlers } from './commands';
import { CommandsController } from './commands.controller';
import { EventHandlers } from './events';
import { Sagas } from './sagas';
@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Item])],
  controllers: [CommandsController],
  providers: [...CommandHandlers, ...EventHandlers, ...Sagas, EventStore],
})
export class CommandsModule {}
