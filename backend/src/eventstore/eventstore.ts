import { Injectable, Logger } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';
import { ItemInsertedToItemsByTagEvent } from '../commands.module/events/item-inserted-to-itemsbytag.event';
import { ItemInsertedEvent } from '../commands.module/events/item-inserted.event';
import { ItemRemovedFromItemsByTagEvent } from '../commands.module/events/item-removed-from-itemsbytag.event';
import { ItemsByTagInsertedEvent } from '../commands.module/events/itemsbytag-inserted.event';
import { TagDecrementedEvent } from '../commands.module/events/tag-decremented.event';
import { TagIncrementedEvent } from '../commands.module/events/tag-incremented.event';
import { TagInsertedEvent } from '../commands.module/events/tag-inserted.event';

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

  private readonly eventMap = new Map<string, any>([
    [ItemInsertedToItemsByTagEvent.name, ItemInsertedToItemsByTagEvent],
    [ItemInsertedEvent.name, ItemInsertedEvent],
    [ItemRemovedFromItemsByTagEvent.name, ItemRemovedFromItemsByTagEvent],
    [ItemsByTagInsertedEvent.name, ItemsByTagInsertedEvent],
    [TagDecrementedEvent.name, TagDecrementedEvent],
    [TagIncrementedEvent.name, TagIncrementedEvent],
    [TagInsertedEvent.name, TagInsertedEvent],
  ]);

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
    this.logger.log(`EventId created: ${eventEntry.id}`);

    this.eventsStream.next(eventEntry);
    this.logger.log(
      `Added #${eventEntry.id} ${eventEntry.type}: ${logStringify(
        eventEntry.event,
      )}`,
    );
    return;
  }
}
