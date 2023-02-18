import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventStoreModule } from '../eventstore/eventstore.module';
import { ItemCommandHandlers } from './item-commands';

@Module({
  imports: [EventStoreModule, CqrsModule],
  providers: [...ItemCommandHandlers],
})
export class CommandsModule {}
