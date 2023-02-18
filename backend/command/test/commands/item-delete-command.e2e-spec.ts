import { HttpService } from '@nestjs/axios';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import * as request from 'supertest';
import { CommandsModule } from '../../src/commands/commands.module';
import { DeleteItemCommand } from '../../src/commands/item-commands/delete-item.command';
import { ControllersModule } from '../../src/controllers/controllers.module';
import { CronModule } from '../../src/cron/cron.module';
import { EventsModule } from '../../src/events/events.module';
import { ALLOWED_EVENT_ENTITIES } from '../../src/eventstore/enums/allowedEntities.enum';
import { EventStore } from '../../src/eventstore/eventstore';
import { EventStoreModule } from '../../src/eventstore/eventstore.module';
import { InternalCommunicationModule } from '../../src/internal-communication/internal-communication.module';
import { DeleteSuggestion } from '../../src/models/delete-suggestion.model';
import { EditSuggestion } from '../../src/models/edit-suggestion.model';
import { GlobalStatistics } from '../../src/models/global-statistics.model';
import { Item } from '../../src/models/item.model';
import { Profile } from '../../src/models/profile.model';
import { Tag } from '../../src/models/tag.model';
import { SagasModule } from '../../src/sagas/sagas.module';
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
import { singleItem } from '../mocks/items';
import { FakeAuthGuardFactory } from '../mocks/jwt-guard.mock';
import { verifiedRequestUser } from '../mocks/users';

describe('Item Deletion (e2e)', () => {
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
  let commandBus: CommandBus;

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
        SagasModule,
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

    mockEventStore.eventBus = app.get<EventBus>(EventBus);

    commandBus = app.get<CommandBus>(CommandBus);
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

  const commandsPath = '/commands/v1/';

  describe('items/:slug/suggest/delete (POST)', () => {
    it('Should add delete suggestion', async () => {
      // ARRANGE
      const item = new itemModel(singleItem);
      await item.save();
      // Create eventstore stream
      mockEventStore.existingStreams.add(
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      );
      // ACT
      const res = await request(server)
        .post(commandsPath + `items/${item.slug}/suggest/delete`)
        .send({ reason: 'test' });
      // ASSERT
      expect(res.status).toEqual(HttpStatus.OK);
      const suggestions = await deleteSuggestionModel.find({});
      expect(suggestions.length).toEqual(1);
      expect(suggestions[0].reason).toEqual('test');
    });

    it('Should increment totalSuggestions count on item delete suggest', async () => {
      const item = new itemModel(singleItem);
      await item.save();
      mockEventStore.existingStreams.add(
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      );

      const globalStatistic = new globalStatisticsModel({
        totalItems: 2,
        totalSuggestions: 0,
      });
      await globalStatistic.save();

      // ACT
      const res = await request(server)
        .post(commandsPath + `items/${item.slug}/suggest/delete`)
        .send({ reason: 'test' });

      // ASSERT
      expect(res.statusCode).toEqual(HttpStatus.OK);
      await retryCallback(
        async () =>
          (await globalStatisticsModel.findOne())?.totalSuggestions !== 0,
      );

      const globalStatistics = await globalStatisticsModel.findOne();
      expect(globalStatistics.totalSuggestions).toEqual(1);
    });

    it('Should increment profile itemsDeleted count', async () => {
      // ARRANGE
      const item = new itemModel(singleItem);
      await item.save();
      // Create eventstore stream
      mockEventStore.existingStreams.add(
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      );
      // ACT
      await request(server)
        .post(commandsPath + `items/${item.slug}/suggest/delete`)
        .send({ reason: 'test' });

      await retryCallback(async () => (await profileModel.count()) !== 0);

      const profile = await profileModel.findOne({});
      expect(profile.count.itemsDeleted).toEqual(1);
    });
  });

  // WARNING: The following tests are for testing the edit functionality itself. As of now this is triggered via
  // a direct insert of the command. In the final product these are triggered via sagas
  // However the current saga implementation is temporary and should therefore not(!) be tested/influence the tests
  describe('DeleteItemCommand', () => {
    it('Should delete item', async () => {
      // ARRANGE
      const item = new itemModel(singleItem);
      await item.save();
      const command = new DeleteItemCommand(
        item.slug,
        randomUUID(),
        verifiedRequestUser.id,
      );
      // Create eventstore stream
      mockEventStore.existingStreams.add(
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      );
      // ACT
      await commandBus.execute(command);
      // ASSERT
      await retryCallback(
        async () => !(await itemModel.findOne({ slug: item.slug })),
      );
      // Does suggestion exist in mongoDb
      const items = await itemModel.find({});
      expect(items.length).toEqual(0);
    });

    it('Should decrement itemCount on item delete', async () => {
      const item = new itemModel(singleItem);
      await item.save();
      mockEventStore.existingStreams.add(
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      );

      const globalStatistic = new globalStatisticsModel({
        totalItems: 2,
        totalSuggestions: 0,
      });
      await globalStatistic.save();

      const command = new DeleteItemCommand(
        item.slug,
        randomUUID(),
        verifiedRequestUser.id,
      );

      // ACT
      await commandBus.execute(command);

      // ASSERT
      await retryCallback(
        async () => (await globalStatisticsModel.findOne())?.totalItems !== 2,
      );

      const globalStatistics = await globalStatisticsModel.findOne();
      expect(globalStatistics.totalItems).toEqual(1);
    });
  });
});
