import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventStore } from './eventstore';

@Module({
  imports: [CqrsModule],
  providers: [EventStore],
  exports: [EventStore],
})
export class EventStoreModule {}
