import { Injectable, Logger } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';
import { ItemCreatedEvent } from '../commands.module/events/item-created.event';

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
        `Handled #${entry.id} ${entry.type}: ${JSON.stringify(
          entry.event,
          null,
          2,
        )}`,
      );
    });
  }

  public addEvent(type: string, event: any) {
    const eventEntry = { id: this.latestId++, type, event };
    this.logger.log(
      `Added #${eventEntry.id} ${eventEntry.type}: ${JSON.stringify(
        eventEntry.event,
        null,
        2,
      )}`,
    );
    this.eventsStream.next(eventEntry);
    return eventEntry.id;
  }
}
