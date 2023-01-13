import { Injectable, Logger } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';
import { ItemCreatedEvent } from '../../src/commands.module/events/item-created.event';

export const logStringify = (obj: any) => {
  return JSON.stringify(obj, null, 2);
};
@Injectable()
export class MockEventStore {
  private readonly logger = new Logger(MockEventStore.name);
  private existingStreams: string[] = [];
  private latestId = 0;
  private eventsStream = new BehaviorSubject<{
    id: number;
    event: any;
    eventType: string;
  }>(null);

  private readonly eventMap = new Map([['ItemCreatedEvent', ItemCreatedEvent]]);

  constructor() {
    this.eventsStream.subscribe((entry) => {
      if (!entry) return;
      entry.event.apply(new (this.eventMap.get(entry.eventType))(entry.event));
      entry.event.commit();
      this.logger.log(
        `Handled #${entry.id} ${entry.eventType}: ${logStringify(entry.event)}`,
      );
    });
  }

  public addEvent(streamId, eventType: any, event: any) {
    const eventEntry = { id: this.latestId++, eventType, event };
    this.eventsStream.next(eventEntry);
    this.existingStreams.push(streamId);
    return eventEntry.id;
  }

  public doesStreamExist(streamId: string) {
    return this.existingStreams.findIndex((e) => e === streamId) > -1;
  }
}
