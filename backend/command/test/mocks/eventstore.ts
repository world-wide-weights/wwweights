import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { ItemDeleteSuggestedEvent } from '../../src/items/events/item-delete-suggested.event';
import { ItemDeletedEvent } from '../../src/items/events/item-deleted.event';
import { ItemEditSuggestedEvent } from '../../src/items/events/item-edit-suggested.event';
import { ItemEditedEvent } from '../../src/items/events/item-edited.event';
import { ItemInsertedEvent } from '../../src/items/events/item-inserted.event';

export const logStringify = (obj: any) => {
  return JSON.stringify(obj, null, 2);
};
@Injectable()
export class MockEventStore {
  private readonly logger = new Logger(MockEventStore.name);
  existingStreams: Set<string> = new Set();
  private latestId = 0;
  eventBus: EventBus;
  public isReady = true;

  private readonly eventMap = new Map<
    string,
    | typeof ItemEditSuggestedEvent
    | typeof ItemInsertedEvent
    | typeof ItemDeleteSuggestedEvent
    | typeof ItemDeletedEvent
    | typeof ItemEditedEvent
  >([
    [ItemInsertedEvent.name, ItemInsertedEvent],
    [ItemEditSuggestedEvent.name, ItemEditSuggestedEvent],
    [ItemDeleteSuggestedEvent.name, ItemDeleteSuggestedEvent],
    [ItemDeletedEvent.name, ItemDeletedEvent],
    [ItemEditedEvent.name, ItemEditedEvent],
  ]);
  public addEvent(streamId, eventType: any, event: any) {
    const eventEntry = { id: this.latestId++, eventType, event };
    this.eventBus.publish(new (this.eventMap.get(eventType))(event));
    this.existingStreams.add(streamId);
    return eventEntry.id;
  }

  public doesStreamExist(streamId: string) {
    return this.existingStreams.has(streamId);
  }

  // Reset eventstore stream state
  reset() {
    this.latestId = 0;
    this.existingStreams.clear();
  }
}
