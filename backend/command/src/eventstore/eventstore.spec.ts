import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventBus, IEvent } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { last, Observable } from 'rxjs';
import { setTimeout } from 'timers/promises';
import { MockConfigService } from '../../test/helpers/config-service.helper';
import { Client } from '../../test/mocks/eventstore-connection';
import { ItemDeletedEvent } from '../events/item-events/item-deleted.event';
import { ItemInsertedEvent } from '../events/item-events/item-inserted.event';
import { Item } from '../models/item.model';
import { ALLOWED_EVENT_ENTITIES } from './enums/allowedEntities.enum';
import { EventStore } from './eventstore';
import { EventStoreModule } from './eventstore.module';

describe('EventstoreModule', () => {
  // Basically disable the constructor to skip Eventstoredb connection
  let app: INestApplication;
  let eventStore: EventStore;
  const client = new Client();
  const mockConfigService = new MockConfigService();
  let eventBus: EventBus;

  async function replaceApp() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), EventStoreModule],
    })
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .compile();

    app = moduleFixture.createNestApplication();
    eventStore = app.get<EventStore>(EventStore);
    await app.init();

    eventStore.isReady = false;
    eventStore['client'] = client as any;
    eventBus = app.get<EventBus>(EventBus);
  }

  beforeEach(async () => {
    await replaceApp();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Playback functionality', () => {
    const SAMPLE_EVENT = {
      event: {
        streamId: `${ALLOWED_EVENT_ENTITIES.ITEM}-`,
        id: 'abc',
        data: { eventType: 1, type: 'ItemCreatedEvent' },
      },
    } as any;

    it('Should be ready instantly if eventstore is empty', async () => {
      // ARRANGE
      client.forcedResult = [];
      //ACT
      await eventStore['init']();
      // delay as init takes a little bit of time
      await setTimeout(100);
      // ASSERT
      expect(eventStore.isReady).toEqual(true);
    });

    it('Should not be ready if necessary event has not been ready', async () => {
      await app.close();
      // ARRANGE
      client.forcedResult = [
        [SAMPLE_EVENT],
        [{ event: { ...SAMPLE_EVENT.event, id: 'def' } }],
      ];
      // Rebuild app to restart init process
      await replaceApp();
      // ACT
      await eventStore['init']();
      // ASSERT
      expect(eventStore.isReady).toEqual(false);
    });

    it('Should be ready instantly "SKIP_READ_DB_REBUILD" is is true', async () => {
      // ARRANGE
      await app.close();
      mockConfigService.values.SKIP_READ_DB_REBUILD = 'true';
      client.forcedResult = [
        [SAMPLE_EVENT],
        [{ event: { ...SAMPLE_EVENT.event, id: 'def' } }],
      ];
      await replaceApp();
      //ACT
      await eventStore['init']();
      // ASSERT
      expect(eventStore.isReady).toEqual(true);
      // Should subscribe to all from the end => all previous are expected already be applied to read db
      expect(client.params[0].fromPosition).toEqual('end');
    });

    it('Should default "SKIP_READ_DB_REBUILD" to false', async () => {
      // ARRANGE
      await app.close();
      mockConfigService.values.SKIP_READ_DB_REBUILD = undefined;

      client.forcedResult = [
        [SAMPLE_EVENT],
        [{ event: { ...SAMPLE_EVENT.event, id: 'def' } }],
      ];
      await replaceApp();
      // ACT
      await eventStore['init']();
      // ASSERT
      expect(eventStore.isReady).toEqual(false);
      // Should subscribe to all from the beginning => needs all events for replay
      expect(client.params[0].fromPosition).toEqual('start');
    });

    it('Should be ready when last event is replayed', async () => {
      // ARRANGE
      client.forcedResult = [[SAMPLE_EVENT], [SAMPLE_EVENT]];

      // ACT
      await eventStore['init']();

      // ASSERT
      expect(eventStore.isReady).toBe(true);
    });
  });

  describe('Protection during setup', () => {
    it('Should reject events when not ready', async () => {
      // ARRANGE
      eventStore.isReady = false;
      // ACT & ASSERT
      expect(
        eventStore.addEvent('a' as any, 'b' as any, 'c' as any),
      ).rejects.toThrow('Backend is not ready yet. Retry later');
    });
  });

  describe('publishEventToBus', () => {
    it('Should publish known event to EventBus', () => {
      // ARRANGE
      const eventData = {
        item: {
          name: 'test',
          slug: 'test',
          weight: { value: 69 },
          userId: 1,
        },
      };

      // ACT
      eventStore['publishEventToBus'](
        typeof ItemInsertedEvent.name,
        eventData as any,
      );

      // ASSERT
      const lastEvent: Observable<ItemInsertedEvent | IEvent> = eventBus.pipe(
        last(),
      );
      lastEvent.subscribe((val) => {
        expect((val as ItemInsertedEvent).item).toEqual(eventData.item);
      });
    });

    it('Should do nothing for empty values', () => {
      // ARRANGE
      const eventBusSpy = jest.spyOn(eventBus, 'publish');
      // ACT
      eventStore['publishEventToBus'](null, null);

      // ASSERT
      expect(eventBusSpy).not.toHaveBeenCalled();
    });

    it('Should do nothing for  unknown event type', () => {
      // ARRANGE
      const eventBusSpy = jest.spyOn(eventBus, 'publish');
      // ACT
      eventStore['publishEventToBus']('NewAndNotSupportedEvent', null);

      // ASSERT
      expect(eventBusSpy).not.toHaveBeenCalled();
    });
  });

  describe('doesStreamExist', () => {
    it('Should return true if stream exists', async () => {
      // ARRANGE
      const responseEvent = {
        event: { data: { eventType: ItemInsertedEvent.name } },
      };
      client.forcedResult = [[responseEvent]];
      // ACT
      const res = await eventStore.doesStreamExist('test-stream');
      // ASSERT
      expect(res).toBe(true);
    });

    it('Should return false if stream has terminating event as last', async () => {
      // ARRANGE
      const responseEvent = {
        event: { data: { eventType: ItemDeletedEvent.name } },
      };
      client.forcedResult = [[responseEvent]];
      // ACT
      const res = await eventStore.doesStreamExist('test-stream');
      // ASSERT
      expect(res).toBe(false);
    });

    it('Should return false if stream does not exist', async () => {
      // ARRANGE
      client.simulateNonExistingStream = true;
      // ACT
      const res = await eventStore.doesStreamExist('test-stream');
      // ASSERT
      expect(res).toBe(false);
    });
  });

  describe('addEvent', () => {
    it('Should add event', async () => {
      // ARRANGE
      eventStore.isReady = true;
      const sample: Item = {
        name: 'test',
        slug: 'test',
        userId: 1,
        weight: {
          value: 420,
        },
      };
      // ACT
      await eventStore.addEvent('test', ItemInsertedEvent.name, sample);

      // ASSERT
      expect(client.params[0]).toEqual('test');
      expect(client.params[1][0].data.eventType).toEqual(
        ItemInsertedEvent.name,
      );
      expect(client.params[1][0].data.value).toEqual(sample);
    });
  });
});
