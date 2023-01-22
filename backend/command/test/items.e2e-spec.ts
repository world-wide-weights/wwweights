import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import * as request from 'supertest';
import { EventStore } from '../src/eventstore/eventstore';
import { EventStoreModule } from '../src/eventstore/eventstore.module';
import { ItemsModule } from '../src/items/items.module';
import { Item } from '../src/models/item.model';
import { ItemsByTag } from '../src/models/items-by-tag.model';
import { Tag } from '../src/models/tag.model';
import {
  initializeMockModule,
  teardownMockDataSource,
} from './helpers/MongoMemoryHelpers';
import { timeout } from './helpers/timeout';
import { MockEventStore } from './mocks/eventstore';
import { differentNames, insertItem, insertItem2 } from './mocks/items';

describe('ItemsController (e2e)', () => {
  let app: INestApplication;
  let itemModel: Model<Item>;
  let tagModel: Model<Tag>;
  let itemsByTagModel: Model<ItemsByTag>;
  const mockEventStore: MockEventStore = new MockEventStore();
  let server: any; // Has to be any because of supertest not having a type for it either
  jest.setTimeout(10000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        initializeMockModule(),
        ItemsModule,
        EventStoreModule,
      ],
    })
      .overrideProvider(EventStore)
      .useValue(mockEventStore)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    itemModel = moduleFixture.get('ItemModel');
    tagModel = moduleFixture.get('TagModel');
    itemsByTagModel = moduleFixture.get('ItemsByTagModel');

    app.setGlobalPrefix('commands/v1');
    await app.init();
    server = app.getHttpServer();

    mockEventStore.eventBus = app.get<EventBus>(EventBus);
  });

  beforeEach(async () => {
    mockEventStore.reset();
    await itemModel.deleteMany();
    await tagModel.deleteMany();
    await itemsByTagModel.deleteMany();
  });

  afterAll(async () => {
    await itemModel.deleteMany();
    await tagModel.deleteMany();
    await itemsByTagModel.deleteMany();
    await teardownMockDataSource();
    server.close();
    await app.close();
  });

  describe('Commands (POSTS) /commands/v1', () => {
    const commandsPath = '/commands/v1/';
    it('items/insert => insert one Item', async () => {
      await request(server)
        .post(commandsPath + 'items/insert')
        .send(insertItem)
        .expect(HttpStatus.OK);

      // We have to wait because of the async nature of the command
      // const attemptSuccess = await retries([
      //   { model: itemModel, count: 1 },
      //   { model: tagModel, count: 2 },
      //   { model: itemsByTagModel, count: 2 },
      // ]);
      // expect(attemptSuccess).toBeTruthy();

      // Also give it some extra time to make sure the tag updates have been completed
      await timeout(500);

      const item = await itemModel.findOne({});

      // Check if Item got correct tags count correct
      expect(item.name).toEqual(insertItem.name);
      expect(item.slug).toBeDefined();
      expect(item.tags[0].count).toEqual(1);
      expect(item.tags[1].count).toEqual(1);

      const tag1 = await tagModel.findOne({ name: 'tag1' });
      const tag2 = await tagModel.findOne({ name: 'tag2' });
      expect(tag1.count).toEqual(1);
      expect(tag2.count).toEqual(1);

      const itemsByTag1 = await itemsByTagModel.findOne({ tagName: 'tag1' });
      const itemsByTag2 = await itemsByTagModel.findOne({ tagName: 'tag2' });

      expect(itemsByTag1).toBeDefined();
      expect(itemsByTag1.items.length).toEqual(1);
      expect(itemsByTag1.items[0].tags[0].name).toEqual(tag1.name);
      expect(itemsByTag1.items[0].tags[0].count).toEqual(1);
      expect(itemsByTag1.items[0].tags[1].name).toEqual(tag2.name);
      expect(itemsByTag1.items[0].tags[1].count).toEqual(1);

      expect(itemsByTag2).toBeDefined();
      expect(itemsByTag2.items.length).toEqual(1);
      expect(itemsByTag2.items[0].tags[0].name).toEqual(tag1.name);
      expect(itemsByTag2.items[0].tags[0].count).toEqual(1);
      expect(itemsByTag2.items[0].tags[1].name).toEqual(tag2.name);
      expect(itemsByTag2.items[0].tags[1].count).toEqual(1);
      return;
    });

    it('items/insert => insert two Items', async () => {
      await request(server)
        .post(commandsPath + 'items/insert')
        .send(insertItem)
        .expect(HttpStatus.OK);
      await timeout(100);
      await request(server)
        .post(commandsPath + 'items/insert')
        .send(insertItem2)
        .expect(HttpStatus.OK);

      // Also give it some extra time to make sure the tag updates have been completed
      await timeout(1000);

      const item1 = await itemModel.findOne({ name: insertItem.name });
      const item2 = await itemModel.findOne({ name: insertItem2.name });

      // Check if Item got correct tags count correct
      expect(item1.tags[0].count).toEqual(2);
      expect(item1.tags[1].count).toEqual(1);
      expect(item2.tags.length).toEqual(1);
      expect(item2.tags[0].count).toEqual(2);

      const tag1 = await tagModel.findOne({ name: 'tag1' });
      const tag2 = await tagModel.findOne({ name: 'tag2' });
      expect(tag1.count).toEqual(2);
      expect(tag2.count).toEqual(1);

      const itemsByTag1 = await itemsByTagModel.findOne({ tagName: 'tag1' });
      const itemsByTag2 = await itemsByTagModel.findOne({ tagName: 'tag2' });

      expect(itemsByTag1).toBeDefined();
      expect(itemsByTag1.items.length).toEqual(2);
      expect(itemsByTag1.items[0].tags[0].name).toEqual(tag1.name);
      expect(itemsByTag1.items[0].tags[0].count).toEqual(2);
      expect(itemsByTag1.items[0].tags[1].name).toEqual(tag2.name);
      expect(itemsByTag1.items[0].tags[1].count).toEqual(1);
      expect(itemsByTag1.items[1].tags[0].name).toEqual(tag1.name);
      expect(itemsByTag1.items[1].tags[0].count).toEqual(2);

      expect(itemsByTag2).toBeDefined();
      expect(itemsByTag2.items.length).toEqual(1);
      expect(itemsByTag2.items[0].tags[0].name).toEqual(tag1.name);
      expect(itemsByTag2.items[0].tags[0].count).toEqual(2);
      expect(itemsByTag2.items[0].tags[1].name).toEqual(tag2.name);
      expect(itemsByTag2.items[0].tags[1].count).toEqual(1);
      return;
    });

    it('items/insert => insert duplicate Items', async () => {
      await request(server)
        .post(commandsPath + 'items/insert')
        .send({ ...insertItem, name: 'This should be in an error message' })
        .expect(HttpStatus.OK);

      await request(server)
        .post(commandsPath + 'items/insert')
        .send({ ...insertItem, name: 'This should be in an error message' })
        .expect(HttpStatus.CONFLICT);

      const items = await itemModel.find({});
      expect(items.length).toEqual(1);
    });

    it('items/insert => insert Items in quick succession', async () => {
      // forEach because we do not want to await in the loop as it would be with for ... of
      differentNames.forEach(async (name) => {
        await request(server)
          .post(commandsPath + 'items/insert')
          .send({ ...insertItem2, name })
          .expect(HttpStatus.OK);
      });
      await timeout(800);
      const items = await itemModel.find({});
      const tag = await tagModel.findOne({ name: 'tag1' });
      const itemsByTag = await itemsByTagModel.findOne({ tagName: 'tag1' });

      expect(items.length).toEqual(differentNames.length);
      expect(tag.count).toEqual(differentNames.length);
      expect(itemsByTag.items.length).toEqual(differentNames.length);
      for (const item of itemsByTag.items) {
        expect(item.tags[0].count).toEqual(differentNames.length);
      }
    });
  });
});