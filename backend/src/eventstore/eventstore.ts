import { Injectable, Logger } from '@nestjs/common';
import {
  EventStoreDBClient,
  FORWARDS,
  jsonEvent,
  START,
  streamNameFilter,
} from '@eventstore/db-client';
import { EventBus } from '@nestjs/cqrs';
import { ItemCreatedEvent } from 'src/commands.module/events/item-created.event';
import { extractTypeFromStreamId, generateStreamId } from './helpers/eventstore.helpers';

export const logStringify = (obj: any) => {
  return JSON.stringify(obj, null, 2);
};
@Injectable()
export class EventStore {
  private readonly logger = new Logger(EventStore.name);
  private client: EventStoreDBClient;
  private readonly eventMap = new Map([['ItemCreatedEvent', ItemCreatedEvent]]);
  constructor(private readonly eventBus: EventBus) {
    console.log('Constructor');
    this.client = EventStoreDBClient.connectionString(
      'esdb://localhost:3011?tls=false',
    );
    this.init();
  }

  private async init() {
    this.logger.verbose('Connection to EventstoreDB successfull');
    const subscription = this.client.subscribeToAll({
      filter: streamNameFilter({
        prefixes: Array.from(this.eventMap.keys()).map((e) => `${e}-`),
      }),
    });
    console.log(Array.from(this.eventMap.keys()).map((e) => `${e}-`));
    for await (const resolvedEvent of subscription) {
      console.log(
        `Received event ${resolvedEvent.event?.revision}@${resolvedEvent.event?.streamId}`,
      );

      await this.publishEventToBus(
        extractTypeFromStreamId(resolvedEvent.event.streamId),
        resolvedEvent.event.data,
      );
    }
    this.logger.verbose(
      'Initialized Stream listener for content streams of eventstore',
    );
  }

  public async addEvent(type: string, identifier: string, event: any) {
    const parsedEvent = jsonEvent({
      type: 'grpc-client',
      data: event,
    });
    await this.client.appendToStream(generateStreamId(type, identifier), [
      parsedEvent,
    ]);
  }

  private publishEventToBus(type: string, event: any) {
    if (!event) return;
    if (!this.eventMap.get(type)) {
      this.logger.warn('Invalid type for event');
      return;
    }
    this.eventBus.publish(new (this.eventMap.get(type))(event));
  }

  async doesStreamExist(streamId: string) {
    const res = this.client.readStream(streamId, { maxCount: 1 });
    console.log('events', res.eventNames());
    // Every stream has one event on first read => prefinish
    if (res.eventNames().length > 1) {
      console.log('returning true')
      return true;
    }
    console.log("returning false")
    return false;
  }
}
