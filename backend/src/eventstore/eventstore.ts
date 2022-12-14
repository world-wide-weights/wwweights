import { Injectable, Logger } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';
import { ItemCreatedEvent } from '../commands.module/events/item-created.event';

export const logStringify = (obj: any) => {
  return JSON.stringify(obj, null, 2);
};
@Injectable()
export class EventStore {
  private readonly logger = new Logger(EventStore.name);
  private latestId = 0;
  private eventsStream = new BehaviorSubject<{
    id: number;
    type: string;
    event: any;
  }>(null);

  private readonly eventMap = new Map([['ItemCreatedEvent', ItemCreatedEvent]]);

  constructor() {
    this.eventsStream.subscribe((entry) => {
      if (!entry) return;
      entry.event.apply(new (this.eventMap.get(entry.type))(entry.event));
      entry.event.commit();
      this.logger.log(
        `Handled #${entry.id} ${entry.type}: ${logStringify(entry.event)}`,
      );
    });
  }

  public addEvent(type: string, event: any) {
    const eventEntry = { id: this.latestId++, type, event };
    this.logger.log(
      `Added #${eventEntry.id} ${eventEntry.type}: ${logStringify(
        eventEntry.event,
      )}`,
    );
    this.eventsStream.next(eventEntry);
    return eventEntry.id;
  }
}
