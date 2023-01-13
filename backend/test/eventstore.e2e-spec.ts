import { EventStoreDBClient, StreamingRead } from '@eventstore/db-client';
import { INestApplication, ServiceUnavailableException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EventStoreModule } from '../src/eventstore/eventstore.module';
import { EventStore } from '../src/eventstore/eventstore';
import { Client, generator } from './mocks/eventstore-connection';
import { ConfigModule } from '@nestjs/config';
import { ALLOWED_EVENT_ENTITIES } from '../src/eventstore/enums/allowedEntities.enum';

describe('EventstoreModule', () => {
  let app: INestApplication;
  let eventStore: EventStore;
  const client = new Client();

  async function replaceApp() {
    EventStoreDBClient.connectionString = jest.fn().mockImplementation(() => {
      return client;
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), EventStoreModule],
    })
      .overrideProvider(EventStoreDBClient)
      .useValue(client)
      .compile();
    app = moduleFixture.createNestApplication();
    eventStore = app.get<EventStore>(EventStore);
    await app.init();
  }

  beforeEach(async () => {
    await replaceApp();
  });
  afterEach(async () => {
    await app.close();
  });

  describe('Playback functionality', () => {
    it('Should be ready instantly if eventstore is empty', () => {
      // ARRANGE
      client.forcedResult = [];
      // ASSERT
      expect(eventStore.isReady).toEqual(true);
    });
    it('Should not be ready if necessary event has not been read', async () => {
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
      // ASSERT
      expect(eventStore.isReady).toEqual(false);
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
