import { HttpModule, HttpService } from '@nestjs/axios';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventBus } from '@nestjs/cqrs';
import { TestingModule, Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import { CommandsModule } from '../../src/commands/commands.module';
import { ControllersModule } from '../../src/controllers/controllers.module';
import { EventsModule } from '../../src/events/events.module';
import { EventStore } from '../../src/eventstore/eventstore';
import { EventStoreModule } from '../../src/eventstore/eventstore.module';
import { InternalCommunicationModule } from '../../src/internal-communication/internal-communication.module';
import { DeleteSuggestion } from '../../src/models/delete-suggestion.model';
import { EditSuggestion } from '../../src/models/edit-suggestion.model';
import { GlobalStatistics } from '../../src/models/global-statistics.model';
import { Item } from '../../src/models/item.model';
import { Profile } from '../../src/models/profile.model';
import { Tag } from '../../src/models/tag.model';
import { ENVGuard } from '../../src/shared/guards/env.guard';
import { JwtAuthGuard } from '../../src/shared/guards/jwt.guard';
import { JwtStrategy } from '../../src/shared/strategies/jwt.strategy';
import {
  initializeMockModule,
  teardownMockDataSource,
} from '../helpers/MongoMemoryHelpers';
import { retryCallback } from '../helpers/retries';
import { FakeEnvGuardFactory } from '../mocks/env-guard.mock';
import { MockEventStore } from '../mocks/eventstore';
import { HttpServiceMock } from '../mocks/http-service.mock';
import {
  insertItem,
  insertItem2,
  differentNames as itemsWithDifferentNames,
  testData,
} from '../mocks/items';
import { FakeAuthGuardFactory } from '../mocks/jwt-guard.mock';
import { verifiedRequestUser } from '../mocks/users';
import * as request from 'supertest';
import { SagasModule } from '../../src/sagas/sagas.module';
import { ItemCronJobHandlerMock } from '../mocks/items-cron.mock';
import { ItemCronJobHandler } from '../../src/cron/cron-handlers/items.cron';
import { CronModule } from '../../src/cron/cron.module';

describe('ItemsController (e2e)', () => {
  let app: INestApplication;
  let itemModel: Model<Item>;
  let tagModel: Model<Tag>;
  let editSuggestionModel: Model<EditSuggestion>;
  let profileModel: Model<Profile>;
  let deleteSuggestionModel: Model<DeleteSuggestion>;
  let globalStatisticsModel: Model<GlobalStatistics>;

  const mockEventStore: MockEventStore = new MockEventStore();
  let server: any; // Has to be any because of supertest not having a type for it either
  const fakeJWTGuard = new FakeAuthGuardFactory();
  const fakeEnvGuard = new FakeEnvGuardFactory();
  const cronMock = new ItemCronJobHandlerMock();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        initializeMockModule(),
        EventsModule,
        CommandsModule,
        ControllersModule,
        EventStoreModule,
        InternalCommunicationModule,
        SagasModule,
        CronModule
      ],
    })
      .overrideProvider(EventStore)
      .useValue(mockEventStore)
      .overrideProvider(JwtStrategy)
      .useValue(null)
      .overrideGuard(JwtAuthGuard)
      .useValue(fakeJWTGuard.getGuard())
      .overrideGuard(ENVGuard)
      .useValue(fakeEnvGuard.getGuard())
      .overrideProvider(HttpService)
      .useClass(HttpServiceMock)
      .overrideProvider(ItemCronJobHandler)
      .useValue(cronMock)
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
    editSuggestionModel = moduleFixture.get('EditSuggestionModel');
    profileModel = moduleFixture.get('ProfileModel');
    deleteSuggestionModel = moduleFixture.get('DeleteSuggestionModel');
    globalStatisticsModel = moduleFixture.get('GlobalStatisticsModel');

    app.setGlobalPrefix('commands/v1');
    await app.init();
    server = app.getHttpServer();

    mockEventStore.eventBus = app.get<EventBus>(EventBus);
  });

  beforeEach(async () => {
    fakeJWTGuard.setAuthResponse(true);
    fakeJWTGuard.setUser(verifiedRequestUser);
    fakeEnvGuard.isDev = false;
    mockEventStore.reset();
    cronMock.reset();
    await itemModel.deleteMany();
    await tagModel.deleteMany();
    await editSuggestionModel.deleteMany();
    await profileModel.deleteMany();
    await deleteSuggestionModel.deleteMany();
    await globalStatisticsModel.deleteMany();
  });

  afterAll(async () => {
    await teardownMockDataSource();
    await server.close();
    await app.close();
  });

  const commandsPath = '/commands/v1/';
  const itemInsertPath = 'items/insert';
  const itemBulkInsertPath = 'items/bulk-insert';

  it('items/insert => insert one Item should fail with auth false', async () => {
    fakeJWTGuard.setAuthResponse(false);
    await request(server)
      .post(commandsPath + 'items/insert')
      .send(insertItem)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('items/insert => insert one Item', async () => {
    await request(server)
      .post(commandsPath + itemInsertPath)
      .send(insertItem)
      .expect(HttpStatus.OK);

    await retryCallback(async () => (await tagModel.count()) !== 0);

    const item = await itemModel.findOne({});

    // Check if Item got correct tags count
    expect(item.name).toEqual(insertItem.name);
    expect(item.slug).toBeDefined();
    expect(item.userId).toEqual(1);

    const tag1 = await tagModel.findOne({ name: 'tag1' });
    const tag2 = await tagModel.findOne({ name: 'tag2' });
    expect(tag1.count).toEqual(1);
    expect(tag2.count).toEqual(1);
  });

  it('items/insert => insert two Items', async () => {
    await request(server)
      .post(commandsPath + itemInsertPath)
      .send(insertItem2)
      .expect(HttpStatus.OK);

    await retryCallback(async () => (await itemModel.count()) === 1);

    await request(server)
      .post(commandsPath + itemInsertPath)
      .send(insertItem)
      .expect(HttpStatus.OK);

    await retryCallback(
      async () => (await tagModel.findOne({ name: 'tag2' })) !== undefined,
    );

    const item1 = await itemModel.findOne({ name: insertItem.name });
    const item2 = await itemModel.findOne({ name: insertItem2.name });

    // Check if Item got correct tags count correct
    expect(item1.tags.length).toEqual(2);
    expect(item2.tags.length).toEqual(1);

    const tag1 = await tagModel.findOne({ name: 'tag1' });
    const tag2 = await tagModel.findOne({ name: 'tag2' });
    expect(tag1.count).toEqual(2);
    expect(tag2.count).toEqual(1);
  });

  it('items/insert => insert duplicate Items', async () => {
    await request(server)
      .post(commandsPath + itemInsertPath)
      .send({ ...insertItem, name: 'This should be in an error message' })
      .expect(HttpStatus.OK);

    await request(server)
      .post(commandsPath + itemInsertPath)
      .send({ ...insertItem, name: 'This should be in an error message' })
      .expect(HttpStatus.CONFLICT);

    const items = await itemModel.find({});
    expect(items.length).toEqual(1);
  });

  it('items/insert => insert Items in quick succession', async () => {
    itemsWithDifferentNames.forEach(async (name) => {
      await request(server)
        .post(commandsPath + itemInsertPath)
        .send({ ...insertItem2, name })
        .expect(HttpStatus.OK);
    });
    await retryCallback(
      async () =>
        (
          await tagModel.findOne({ slug: itemsWithDifferentNames[-1] })
        )?.count === itemsWithDifferentNames.length,
    );
    const items = await itemModel.find({});
    const tag = await tagModel.findOne({ name: 'tag1' });

    expect(items.length).toEqual(itemsWithDifferentNames.length);
    expect(tag.count).toEqual(itemsWithDifferentNames.length);
  });

  it('items/insert => increment profile counts', async () => {
    await request(server)
      .post(commandsPath + itemInsertPath)
      .send(insertItem)
      .expect(HttpStatus.OK);

    await retryCallback(async () => (await profileModel.count()) === 1);

    const profile = await profileModel.findOne({});
    expect(profile.count.itemsCreated).toEqual(1);
    expect(profile.count.additionalValueOnCreation).toEqual(0);
    expect(profile.count.tagsUsedOnCreation).toEqual(2);
    expect(profile.count.sourceUsedOnCreation).toEqual(0);
    expect(profile.count.imageAddedOnCreation).toEqual(0);
  });

  it('Should increment totalItems count on item insert', async () => {
    await request(server)
      .post(commandsPath + itemInsertPath)
      .send(insertItem)
      .expect(HttpStatus.OK);

    await retryCallback(
      async () => (await globalStatisticsModel.count()) !== 0,
    );

    expect((await globalStatisticsModel.findOne()).totalItems).toEqual(1);
  });

  it('items/bulk-insert => Should be hidden if env guard fails', async () => {
    // ACT
    const res = await request(server)
      .post(commandsPath + itemBulkInsertPath)
      .send(testData.slice(0, 5));
    // ASSERT
    expect(res.status).toEqual(HttpStatus.NOT_FOUND);
  });

  it('items/bulk-insert => Should insert multiple items', async () => {
    // ARRANGE
    fakeEnvGuard.isDev = true;
    const data = testData.slice(0, 5);
    // ACT
    const res = await request(server)
      .post(commandsPath + itemBulkInsertPath)
      .send(data);
    // ASSERT
    expect(res.status).toEqual(HttpStatus.OK);
    await retryCallback(async () => (await itemModel.find({}))?.length === 5);
    const items = await itemModel.find({});
    expect(items.length).toEqual(5);
  });

  it('items/bulk-insert => Should allow to set userId', async () => {
    // ARRANGE
    await itemModel.deleteMany();
    fakeEnvGuard.isDev = true;
    const userId = 12;
    const insertItems = testData
      .slice(0, 5)
      .map((e) => ({ ...e, userId: userId }));
    // ACT
    const res = await request(server)
      .post(commandsPath + itemBulkInsertPath)
      .send(insertItems);
    // ASSERT
    expect(res.status).toEqual(HttpStatus.OK);
    await retryCallback(async () => (await itemModel.find({})).length === 5);
    const items = await itemModel.find({});
    for (const item of items) {
      expect(item.userId).toEqual(userId);
    }
  });

  it('items/bulk-insert => Should default to userId of 0', async () => {
    // ARRANGE
    await itemModel.deleteMany();
    fakeEnvGuard.isDev = true;
    const data = testData.slice(0, 5);
    // ACT
    const res = await request(server)
      .post(commandsPath + itemBulkInsertPath)
      .send(data);
    // ASSERT
    expect(res.status).toEqual(HttpStatus.OK);
    await retryCallback(async () => (await itemModel.find({})).length !== 0);
    const items = await itemModel.find({});
    for (const item of items) {
      expect(item.userId).toEqual(0);
    }
  });

  it('items/bulk-insert => Should call cronjob', async () => {
    // ARRANGE
    await itemModel.deleteMany();
    fakeEnvGuard.isDev = true;
    const data = testData.slice(0, 5);
    // ACT
    const res = await request(server)
      .post(commandsPath + itemBulkInsertPath)
      .send(data);
    // ASSERT
    expect(res.status).toEqual(HttpStatus.OK);
    // No tests needed as callback throws an error if condition is never met
    await retryCallback(
      async () => !cronMock.correctAllItemTagCountsHasBeenCalled,
    );
  });
});
