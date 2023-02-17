import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeout } from 'timers/promises';
import { ALLOWED_EVENT_ENTITIES } from '../src/eventstore/enums/allowedEntities.enum';
import { EventStore } from '../src/eventstore/eventstore';
import { EventStoreModule } from '../src/eventstore/eventstore.module';
import { Client } from './mocks/eventstore-connection';

describe('EventstoreModule', () => {
  // Basically disable the constructor to skip Eventstoredb connection
  process.env.TEST_MODE = 'true';
  let app: INestApplication;
  let eventStore: EventStore;
  const client = new Client();

  async function replaceApp() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), EventStoreModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    eventStore = app.get<EventStore>(EventStore);
    await app.init();
    eventStore.isReady = false;
    eventStore['client'] = client as any;
  }

  beforeEach(async () => {
    process.env.SKIP_READ_DB_REBUILD = 'false';
    await replaceApp();
  });
  afterEach(async () => {
    await app.close();
  });

  describe('Playback functionality', () => {
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
      const eventList = {
        event: {
          streamId: `${ALLOWED_EVENT_ENTITIES.ITEM}-`,
          id: 'abc',
          data: { eventType: 1, type: 'ItemCreatedEvent' },
        },
      } as any;
      client.forcedResult = [
        [eventList],
        [{ event: { ...eventList.event, id: 'def' } }],
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
      process.env.SKIP_READ_DB_REBUILD = 'true';
      const eventList = {
        event: {
          streamId: `${ALLOWED_EVENT_ENTITIES.ITEM}-`,
          id: 'abc',
          data: { eventType: 1, type: 'ItemCreatedEvent' },
        },
      } as any;
      client.forcedResult = [
        [eventList],
        [{ event: { ...eventList.event, id: 'def' } }],
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
      process.env.SKIP_READ_DB_REBUILD = undefined;
      const eventList = {
        event: {
          streamId: `${ALLOWED_EVENT_ENTITIES.ITEM}-`,
          id: 'abc',
          data: { eventType: 1, type: 'ItemCreatedEvent' },
        },
      } as any;
      client.forcedResult = [
        [eventList],
        [{ event: { ...eventList.event, id: 'def' } }],
      ];
      await replaceApp();
      // ACT
      await eventStore['init']();
      // ASSERT
      expect(eventStore.isReady).toEqual(false);
      // Should subscribe to all from the beginning => needs all events for replay
      expect(client.params[0].fromPosition).toEqual('start');
    });
  });
  describe('Protection during setup', () => {
    it('Should reject events when not ready', async () => {
      // ARRANGE
      eventStore.isReady = false;
      // ASSERT
      expect(eventStore.addEvent('a', 'b', 'c')).rejects.toThrow(
        'Backend is not ready yet. Retry later',
      );
    });
  });
});
