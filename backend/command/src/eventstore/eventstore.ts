import {
  AllStreamResolvedEvent,
  BACKWARDS as SDRAWKCAB,
  ChannelCredentialOptions,
  END,
  EventStoreDBClient,
  jsonEvent,
  ReadPosition,
  START,
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
import { readFileSync } from 'fs';
import { ItemDeleteSuggestedEvent } from '../events/item-events/item-delete-suggested.event';
import { ItemDeletedEvent } from '../events/item-events/item-deleted.event';
import { ItemEditSuggestedEvent } from '../events/item-events/item-edit-suggested.event';
import { ItemEditedEvent } from '../events/item-events/item-edited.event';
import { ItemInsertedEvent } from '../events/item-events/item-inserted.event';
import { ALLOWED_EVENT_ENTITIES } from './enums/allowedEntities.enum';
import { AllowedEventInputs } from './types/allowed-event-inputs.type';

/**
 * @description Wrapper for eventstoreDb. Used for save interaction with eventstore
 */
@Injectable()
export class EventStore {
  private readonly logger = new Logger(EventStore.name);
  private client: EventStoreDBClient;
  // Duplicate type definitions as using premade type is not allowed here
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
  isReady = false;

  constructor(
    private readonly eventBus: EventBus,
    private readonly configService: ConfigService,
  ) {
    // Add to allow for testing and return here, the rest of the constructor is not needed and would fail due to grpc
    if (process.env.TEST_MODE === 'true') {
      return;
    }

    // Locally we can run with this
    let sslOptions: ChannelCredentialOptions = {
      insecure: true,
    };

    // If connecting to secure instance we need this
    /* istanbul ignore if */
    if (this.configService.get<string>('DB_EVENTSTORE_USE_TLS') === 'true') {
      sslOptions = {
        insecure: false,
        rootCertificate: readFileSync(
          this.configService.get<string>('DB_EVENTSTORE_ROOT_CA_PATH'),
        ),
      };
    }

    /* istanbul ignore next */
    this.client = new EventStoreDBClient(
      {
        endpoint: this.configService.get<string>('DB_EVENTSTORE_HOST'),
      },
      sslOptions,
      {
        username: this.configService.get<string>('DB_EVENTSTORE_USERNAME'),
        password: this.configService.get<string>('DB_EVENTSTORE_PW'),
      },
    );
    /* istanbul ignore next */
    this.init();
  }

  /**
   * @description Handle past events and the respective rebuild, initialize event subscription
   */
  private async init() {
    // Convert string to boolean
    const SKIP_READ_DB_REBUILD =
      this.configService.get<string>('SKIP_READ_DB_REBUILD')?.toLowerCase() ===
      'true';
    this.logger.debug('Starting subscription to Eventstore');
    let lastEvent: AllStreamResolvedEvent = null;
    let readAllStart: ReadPosition = END;
    // If not skip => get last stream event
    if (!SKIP_READ_DB_REBUILD) {
      lastEvent = await this.getLastEvent();
      readAllStart = START;
    }

    // Skip protective rebuild period of no events are in eventstore
    if (!lastEvent) {
      const skipMessage = !SKIP_READ_DB_REBUILD
        ? 'Eventstore Replay skipped as it was empty'
        : 'Eventstore Replay skipped as "SKIP_READ_DB_REBUILD" is set to true';
      this.logger.verbose(skipMessage);
      this.isReady = true;
    }

    const subscription = this.client.subscribeToAll({
      filter: streamNameFilter({
        // Build valid stream names by eventmap
        prefixes: Object.values(ALLOWED_EVENT_ENTITIES).map((e) => `${e}-`),
      }),
      fromPosition: readAllStart,
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
        // Use any as types from eventstore client package are not in sync to actual db
        (resolvedEvent?.event?.data as any)?.eventType,
        (resolvedEvent?.event?.data as any)?.value,
      );
    }

    this.logger.verbose(
      'Initialized Stream listener for content streams of eventstore',
    );
  }

  /**
   * @description Get last event in content streams
   */
  private async getLastEvent(): Promise<AllStreamResolvedEvent> {
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
        )
      ) {
        // Event found, there is no need for this anymore
        await lastEventStream.cancel();
        return resolvedEvent;
      }
    }
  }

  /**
   * @description Add event to stream
   */
  public async addEvent(
    streamId,
    eventType: string,
    event: AllowedEventInputs,
  ): Promise<void> {
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
   * @description Take event along with its typing and publish it to the cqrs event bus
   */
  private publishEventToBus(
    eventType: string,
    // Not the prettiest solution but union types do not seem to work
    event:
      | typeof ItemEditSuggestedEvent
      | typeof ItemInsertedEvent
      | typeof ItemDeleteSuggestedEvent
      | typeof ItemDeletedEvent
      | typeof ItemEditedEvent,
  ): Promise<void> {
    if (!event) return;
    if (!this.eventMap.get(eventType)) {
      this.logger.error(`Invalid eventtype for eventbus ${eventType}`);
      return;
    }
    // any conversion as map does not allow for union type
    this.eventBus.publish(new (this.eventMap.get(eventType) as any)(event));
    this.logger.debug(`Published ${eventType} to event bus`);
  }

  /**
   * @description Determine whether or not a stream with a given id exists
   */
  async doesStreamExist(streamId: string): Promise<boolean> {
    const result = this.client.readStream(streamId, {
      direction: SDRAWKCAB,
      fromRevision: END,
      maxCount: 1,
    });
    try {
      for await (const event of result) {
        // Is last event terminating? If yes, the stream is considered non existant
        return (event?.event?.data as any)?.eventType !== ItemDeletedEvent.name;
      }
    } catch (error) {
      if (error instanceof StreamNotFoundError) {
        return false;
      }
      // This may be an Connection lost error etc. Anyway we throw it
      throw error;
    }
    return true;
  }
}
