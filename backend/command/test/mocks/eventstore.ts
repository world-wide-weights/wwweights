import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { ItemInsertedEvent } from '../../src/items/events/item-inserted.event';

export const logStringify = (obj: any) => {
  return JSON.stringify(obj, null, 2);
};
@Injectable()
export class MockEventStore {
  private readonly logger = new Logger(MockEventStore.name);
  existingStreams: string[] = [];
  private latestId = 0;
  eventBus: EventBus;

  private readonly eventMap = new Map([
    [ItemInsertedEvent.name, ItemInsertedEvent],
  ]);

  public addEvent(streamId, eventType: any, event: any) {
    const eventEntry = { id: this.latestId++, eventType, event };
    this.eventBus.publish(new (this.eventMap.get(eventType))(event));
    this.existingStreams.push(streamId);
    return eventEntry.id;
  }

  public doesStreamExist(streamId: string) {
    return this.existingStreams.findIndex((e) => e === streamId) > -1;
  }

  // Reset eventstore stream state
  reset() {
    this.latestId = 0;
    this.existingStreams = [];
  }
}
