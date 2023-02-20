import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventStoreModule } from '../eventstore/eventstore.module';
import { ItemSagas } from './item-sagas';

@Module({
  imports: [CqrsModule, EventStoreModule],
  providers: [...ItemSagas],
})
export class SagasModule {}
