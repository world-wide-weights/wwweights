import { HttpService } from '@nestjs/axios';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { CommandsModule } from '../src/commands/commands.module';
import { ControllersModule } from '../src/controllers/controllers.module';
import { ItemCronJobHandler } from '../src/cron/cron-handlers/items.cron';
import { CronModule } from '../src/cron/cron.module';
import { EventsModule } from '../src/events/events.module';
import { EventStore } from '../src/eventstore/eventstore';
import { EventStoreModule } from '../src/eventstore/eventstore.module';
import { InternalCommunicationModule } from '../src/internal-communication/internal-communication.module';
import { DeleteSuggestion } from '../src/models/delete-suggestion.model';
import { EditSuggestion } from '../src/models/edit-suggestion.model';
import { GlobalStatistics } from '../src/models/global-statistics.model';
import { Item } from '../src/models/item.model';
import { Profile } from '../src/models/profile.model';
import { Tag } from '../src/models/tag.model';
import { ENVGuard } from '../src/shared/guards/env.guard';
import { JwtAuthGuard } from '../src/shared/guards/jwt.guard';
import { JwtStrategy } from '../src/shared/strategies/jwt.strategy';
import {
  initializeMockModule,
  teardownMockDataSource,
} from './helpers/MongoMemoryHelpers';
import { FakeEnvGuardFactory } from './mocks/env-guard.mock';
import { MockEventStore } from './mocks/eventstore';
import { HttpServiceMock } from './mocks/http-service.mock';
import { singleItem, singleItemTags } from './mocks/items';
import { FakeAuthGuardFactory } from './mocks/jwt-guard.mock';
import { verifiedRequestUser } from './mocks/users';

describe('ItemsController (e2e)', () => {
  let app: INestApplication;
  let itemModel: Model<Item>;
  let tagModel: Model<Tag>;
  let editSuggestionModel: Model<EditSuggestion>;
  let profileModel: Model<Profile>;
  let deleteSuggestionModel: Model<DeleteSuggestion>;
  let globalStatisticsModel: Model<GlobalStatistics>;

  const mockEventStore: MockEventStore = new MockEventStore();
  let itemCronJobHandler: ItemCronJobHandler;
  let server: any; // Has to be any because of supertest not having a type for it either
  const fakeJWTGuard = new FakeAuthGuardFactory();
  const fakeEnvGuard = new FakeEnvGuardFactory();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        initializeMockModule(),
        EventsModule,
        CronModule,
        CommandsModule,
        ControllersModule,
        EventStoreModule,
        InternalCommunicationModule,
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

    itemCronJobHandler = app.get<ItemCronJobHandler>(ItemCronJobHandler);

    mockEventStore.eventBus = app.get<EventBus>(EventBus);
  });

  beforeEach(async () => {
    fakeJWTGuard.setAuthResponse(true);
    fakeJWTGuard.setUser(verifiedRequestUser);
    fakeEnvGuard.isDev = false;
    mockEventStore.reset();
    await itemModel.deleteMany();
    await tagModel.deleteMany();
    await editSuggestionModel.deleteMany();
    await profileModel.deleteMany();
    await deleteSuggestionModel.deleteMany();
    await globalStatisticsModel.deleteMany();
  });

  afterAll(async () => {
    await teardownMockDataSource();
    server.close();
    await app.close();
  });

  describe('correctAllItemTagCounts (CRON)', () => {
    it('Should update item counts', async () => {
      // ARRANGE
      await itemModel.insertMany([
        {
          ...singleItem,
          tags: [
            {
              ...singleItem.tags[0],
              count: 0,
            },
            {
              ...singleItem.tags[1],
            },
          ],
        },
        {
          ...singleItem,
          name: 'justTest',
          slug: 'justtest',
          tags: [singleItem.tags[0]],
        },
      ]);
      await tagModel.insertMany([
        { ...singleItemTags[0], count: 2 },
        { ...singleItemTags[1], count: 1 },
      ]);
      // ACT
      await itemCronJobHandler.correctAllItemTagCounts();
      // ASSERT
      const firstItem = await itemModel.findOne({ slug: singleItem.slug });

      const secondItem = await itemModel.findOne({ slug: 'justtest' });
      expect(firstItem.tags[0].count).toEqual(2);
      expect(firstItem.tags[1].count).toEqual(1);

      expect(secondItem.tags[0].count).toEqual(2);
    });
  });

  describe('deleteUnusedTags (CRON)', () => {
    it('Should delete unused Tags from Tags', async () => {
      // ARRANGE
      await tagModel.insertMany([
        ...singleItemTags,
        { name: 'tobedeleted', count: 0 },
      ]);
      // ACT
      await itemCronJobHandler.deleteUnusedTags();
      // ASSERT
      const newTagList = await tagModel.find({});
      expect(newTagList.length).toEqual(2);
      expect(
        newTagList.find((e) => e.name === 'tobedeleted' && e.count === 0),
      ).toBeUndefined();
    });

    it('Should work even when no changes are needed', async () => {
      // ARRANGE
      await tagModel.insertMany(singleItemTags);
      // ACT
      await itemCronJobHandler.deleteUnusedTags();
      // ASSERT
      const tags = await tagModel.find({});
      expect(tags.length).toEqual(singleItemTags.length);
    });
  });
});
