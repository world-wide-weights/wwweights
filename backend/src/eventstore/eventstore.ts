import { Injectable, Logger } from '@nestjs/common';
import {
  BACKWARDS,
  EventStoreDBClient,
  jsonEvent,
  streamNameFilter,
  StreamNotFoundError,
} from '@eventstore/db-client';
import { EventBus } from '@nestjs/cqrs';
import { ItemCreatedEvent } from 'src/commands.module/events/item-created.event';
import {
  extractTypeFromStreamId,
  generateStreamId,
} from './helpers/eventstore.helpers';
import { ALLOWED_EVENT_ENTITIES } from './enums/allowedEntities.enum';

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
        // Build valid stream names by eventmap
        prefixes: Object.values(ALLOWED_EVENT_ENTITIES).map((e) => `${e}-`),
      }),
    });
    for await (const resolvedEvent of subscription) {
      console.log(
        `Received event over eventstore stream ${resolvedEvent.event?.revision}@${resolvedEvent.event?.streamId}`,
      );

      this.publishEventToBus(
        (resolvedEvent.event.data as any).eventType,
        (resolvedEvent.event.data as any).value,
      );
    }
    this.logger.verbose(
      'Initialized Stream listener for content streams of eventstore',
    );
  }

  public async addEvent(
    entityType: string,
    eventType: any,
    identifier: string,
    event: any,
  ) {
    const parsedEvent = jsonEvent({
      type: 'grpc-client',
      data: { value: event, eventType: eventType },
    });
    await this.client.appendToStream(generateStreamId(entityType, identifier), [
      parsedEvent,
    ]);
  }

  /**
   * @description Take event along with its typing and publish it to the cqrs event buspublish it to the cqrs event bus
   */
  private publishEventToBus(eventType: any, event: any) {
    if (!event) return;
    if (!this.eventMap.get(eventType)) {
      this.logger.error(`Invalid eventtype for eventbus ${eventType}`);
      return;
    }
    this.logger.debug(`Publishing ${eventType} to event bus`);
    this.eventBus.publish(new (this.eventMap.get(eventType))(event));
  }

  /**
   * @description Determine whether or not a stream with a given id exists
   */
  async doesStreamExist(streamId: string) {
    const result = await this.client.readStream(streamId, {
      direction: BACKWARDS,
      maxCount: 1,
    });
    try {
      for await (const event of result) {
        return true;
      }
    } catch (e) {
      if (e instanceof StreamNotFoundError) {
        return false;
      }
      throw e;
    }
    return true;
  }
}
