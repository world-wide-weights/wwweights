import {
  AllStreamResolvedEvent,
  BACKWARDS as SDRAWKCAB,
  END,
  EventStoreDBClient,
  jsonEvent,
  StreamingRead,
  streamNameFilter,
  StreamNotFoundError,
} from '@eventstore/db-client';
import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventBus } from '@nestjs/cqrs';
import { ItemInsertedEvent } from '../items/events/item-inserted.event';
import { ALLOWED_EVENT_ENTITIES } from './enums/allowedEntities.enum';

/**
 * @description Wrapper for eventstoreDb. Used for save interaction with eventstore
 */
@Injectable()
export class EventStore {
  private readonly logger = new Logger(EventStore.name);
  private client: EventStoreDBClient;
  private readonly eventMap = new Map([
    [ItemInsertedEvent.name, ItemInsertedEvent],
  ]);
  isReady = false;

  constructor(
    private readonly eventBus: EventBus,
    private readonly configService: ConfigService,
  ) {
    this.client = EventStoreDBClient.connectionString(
      `esdb://${configService.get<string>(
        'DB_EVENTSTORE_USERNAME',
      )}:${configService.get<string>(
        'DB_EVENTSTORE_PW',
      )}@${configService.get<string>(
        'DB_EVENTSTORE_HOST',
      )}?tls=${configService.get<string>('DB_EVENTSTORE_USE_TLS')}`,
    );
    this.init();
  }

  /**
   * @description Handle past events and the respective rebuild, initialize event subscription
   */
  private async init() {
    this.logger.debug('Starting subscription to Eventstore');
    let lastEvent: AllStreamResolvedEvent;
    // Get last event from all streams
    const lastEventStream: StreamingRead<AllStreamResolvedEvent> =
      this.client.readAll({
        direction: SDRAWKCAB,
        fromPosition: END,
      });

    for await (const resolvedEvent of lastEventStream) {
      // Check if stream of event is one of the content relevant streams
      if (
        resolvedEvent?.event?.streamId?.match(
          `(${Object.values(ALLOWED_EVENT_ENTITIES)
            .map((e) => `${e}-`)
            .join('|')}).*`,
        ) &&
        !lastEvent
      ) {
        lastEvent = resolvedEvent;
        // Event found, there is no need for this anymore
        await lastEventStream.cancel();
      }
    }
    // Skip protective rebuild period of no events are in eventstore
    if (!lastEvent) {
      this.logger.verbose('Eventstore Replay skipped as it was empty');
      this.isReady = true;
    }

    const subscription = this.client.subscribeToAll({
      filter: streamNameFilter({
        // Build valid stream names by eventmap
        prefixes: Object.values(ALLOWED_EVENT_ENTITIES).map((e) => `${e}-`),
      }),
    });
    for await (const resolvedEvent of subscription) {
      this.logger.debug(
        `Received event over eventstore stream ${resolvedEvent.event?.revision}@${resolvedEvent.event?.streamId}`,
      );

      // If fetched event is the last event in store at startup time => rebuild is done
      if (
        !this.isReady &&
        resolvedEvent.event.id === lastEvent.event.id &&
        resolvedEvent.event.streamId === lastEvent.event.streamId
      ) {
        this.isReady = true;
        this.logger.verbose(
          'Finished Eventstore replay. Now ready to accept events',
        );
      }

      this.publishEventToBus(
        (resolvedEvent?.event?.data as any)?.eventType,
        (resolvedEvent?.event?.data as any)?.value,
      );
    }
    this.logger.verbose(
      'Initialized Stream listener for content streams of eventstore',
    );
  }

  /**
   * @description Add event to stream
   */
  public async addEvent(streamId, eventType: any, event: any) {
    // If replay is not ready, don´t accept events to avoid inconsistent data
    if (!this.isReady) {
      throw new ServiceUnavailableException(
        'Backend is not ready yet. Retry later',
      );
    }
    const parsedEvent = jsonEvent({
      type: 'grpc-client',
      data: { value: event, eventType: eventType },
    });
    await this.client.appendToStream(streamId, [parsedEvent]);
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
    const result = this.client.readStream(streamId, {
      direction: SDRAWKCAB,
      maxCount: 1,
    });
    try {
      for await (const _ of result) {
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
