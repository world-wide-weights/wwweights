import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventStoreModule } from '../eventstore/eventstore.module';
import { Item } from '../models/item.model';
import { CommandHandlers } from './commands';
import { CommandsController } from './commands.controller';
import { EventHandlers } from './events';
import { Sagas } from './sagas';
@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Item]), EventStoreModule],
  controllers: [CommandsController],
  providers: [...CommandHandlers, ...EventHandlers, ...Sagas],
})
export class CommandsModule {}
