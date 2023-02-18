import { HttpService } from '@nestjs/axios';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import * as request from 'supertest';
import { CommandsModule } from '../../src/commands/commands.module';
import { EditItemCommand } from '../../src/commands/item-commands/edit-item.command';
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

  describe('EditItemCommand', () => {
    it('items/:slug/suggest/edit => Should create a suggestion', async () => {
      // ARRANGE
      const item = new itemModel(singleItem);
      await item.save();
      // Create eventstore stream
      mockEventStore.existingStreams.add(
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      );
      //ACT
      const res = await request(server)
        .post(commandsPath + `items/${encodeURI(item.slug)}/suggest/edit`)
        .send({ image: 'test' });

      await retryCallback(
        async () => (await editSuggestionModel.count()) === 1,
      );

      // ASSERT
      expect(res.status).toEqual(HttpStatus.OK);
      // Has suggestion gone through eventstore?
      expect(mockEventStore.existingStreams.size).toEqual(2);
      // Does suggestion exist in mongoDb
      const suggestions = await editSuggestionModel.find();
      expect(suggestions.length).toEqual(1);
      expect(suggestions[0].updatedItemValues.image).toEqual('test');
    });

    it('items/:slug/suggest/edit => Should add correct user to suggestion', async () => {
      // ARRANGE
      const item = new itemModel(singleItem);
      await item.save();
      // Create eventstore stream
      mockEventStore.existingStreams.add(
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      );
      //ACT
      const res = await request(server)
        .post(commandsPath + `items/${item.slug}/suggest/edit`)
        .send({ image: 'test' });
      // ASSERT
      expect(res.status).toEqual(HttpStatus.OK);
      // Does suggestion exist in mongoDb
      const suggestion = await editSuggestionModel.findOne({
        itemSlug: item.slug,
      });
      expect(suggestion.userId).toEqual(verifiedRequestUser.id);
    });

    // WARNING: The following tests are for testing the edit functionality itself. As of now this is triggered via
    // a direct insert of the command. In the final product these are triggered via sagas
    // However the current saga implementation is temporary and should therefore not(!) be tested/influence the tests

    it('EditItemCommand => Should update item', async () => {
      // ARRANGE
      const item = new itemModel(singleItem);
      await item.save();
      const command = new EditItemCommand(item.slug, randomUUID(), {
        image: 'test',
      });
      // Create eventstore stream
      mockEventStore.existingStreams.add(
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      );
      //ACT
      commandBus.execute(command);
      // ASSERT
      // This will pass if met or throw an error if callback condition is never met
      await retryCallback(
        async () =>
          // Has item been updated?
          (await itemModel.findOne({ slug: item.slug })).image === 'test',
      );
    });

    it('EditItemCommand => Should be able to set property to null', async () => {
      // ARRANGE
      const item = new itemModel(singleItem);
      await item.save();
      const command = new EditItemCommand(item.slug, randomUUID(), {
        source: null,
      });
      // Create eventstore stream
      mockEventStore.existingStreams.add(
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      );
      //ACT
      await commandBus.execute(command);
      // ASSERT
      // This will pass if met or throw an error if callback condition is never met
      await retryCallback(
        async () =>
          // Has item been updated?
          (await itemModel.findOne({ slug: item.slug })).source === null,
      );
    });

    it('EditItemCommand => Should be able to update weight (nested Object)', async () => {
      // ARRANGE
      const item = new itemModel({
        ...singleItem,
        weight: {
          value: 1123675e30,
          isCa: false,
          additionalValue: 3333333e30,
        },
      });
      await item.save();
      const command = new EditItemCommand(item.slug, randomUUID(), {
        weight: {
          value: 2222222e30,
        },
      });
      // Create eventstore stream
      mockEventStore.existingStreams.add(
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      );
      //ACT
      await commandBus.execute(command);
      // ASSERT
      // This will pass if met or throw an error if callback condition is never met
      await retryCallback(
        async () =>
          // Has item been updated?
          (await itemModel.findOne({ slug: item.slug })).weight.value ===
          command.editValues.weight.value,
      );
      const updatedItem = await itemModel.findOne({ slug: item.slug }).lean();
      expect(updatedItem.weight).toEqual({
        value: command.editValues.weight.value,
        isCa: item.weight.isCa,
        additionalValue: item.weight.additionalValue,
      });
    });

    it('EditItemCommand => Should be able to remove fields in weight (nested Object)', async () => {
      // ARRANGE
      const item = new itemModel({
        ...singleItem,
        weight: { value: 1123675e30, isCa: true },
      });
      await item.save();
      const command = new EditItemCommand(item.slug, randomUUID(), {
        weight: {
          value: 2222222e30,
          isCa: null,
        },
      });

      // Create eventstore stream
      mockEventStore.existingStreams.add(
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      );
      //ACT
      await commandBus.execute(command);
      // ASSERT
      // This will pass if met or throw an error if callback condition is never met
      await retryCallback(
        async () =>
          // Has item been updated?
          (await itemModel.findOne({ slug: item.slug })).weight.value ===
          command.editValues.weight.value,
      );
      const updatedItem = await itemModel.findOne({ slug: item.slug });
      // Weight check is redundant with callback
      expect(updatedItem.weight.isCa).toBeNull();
    });

    it('EditItemCommand => Should remove tags to item', async () => {
      // ARRANGE
      const item = new itemModel(singleItem);
      await item.save();
      const command = new EditItemCommand(item.slug, randomUUID(), {
        tags: { pull: [item.tags[0].name] },
      });
      // Create eventstore stream
      mockEventStore.existingStreams.add(
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      );
      //ACT
      await commandBus.execute(command);
      // ASSERT
      await retryCallback(
        async () =>
          (await itemModel.findOne({ slug: item.slug })).tags?.length <
          item.tags.length,
      );
      const updatedItem = await itemModel.findOne({ slug: item.slug });
      // Count does not matter in this case
      expect(updatedItem.tags.map((t) => t.name)).not.toContain(
        item.tags[0].name,
      );
    });

    it('EditItemCommand => Should add tags to item', async () => {
      // ARRANGE
      const item = new itemModel(singleItem);
      await item.save();
      const command = new EditItemCommand(item.slug, randomUUID(), {
        tags: { push: ['newTag1'] },
      });
      // Create eventstore stream
      mockEventStore.existingStreams.add(
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      );
      //ACT
      await commandBus.execute(command);
      // ASSERT
      await retryCallback(
        async () =>
          (await itemModel.findOne({ slug: item.slug })).tags?.length >
          item.tags.length,
      );
      const updatedItem = await itemModel.findOne({ slug: item.slug });
      // Count does not matter in this case
      expect(updatedItem.tags.map((t) => t.name)).toContain('newTag1');
    });

    it('EditItemCommand => Should add AND remove tags from item', async () => {
      // ARRANGE
      const item = new itemModel(singleItem);
      await item.save();
      const command = new EditItemCommand(item.slug, randomUUID(), {
        tags: { push: ['newTag1'], pull: [item.tags[0].name] },
      });
      // Create eventstore stream
      mockEventStore.existingStreams.add(
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      );
      //ACT
      await commandBus.execute(command);
      // ASSERT
      await retryCallback(async () => {
        // Have tags in item been updated?
        const tags = (await itemModel.findOne({ slug: item.slug })).tags.map(
          (tag) => tag.name,
        );
        return tags.includes('newTag1') && !tags.includes(item.tags[0].name);
      });
      const updatedItem = await itemModel.findOne({ slug: item.slug });
      // Count does not matter in this case
      expect(updatedItem.tags.map((t) => t.name)).toContain('newTag1');
    });

    it('EditItemCommand => Should update tags in Tags', async () => {
      // ARRANGE
      const item = new itemModel(singleItem);
      await item.save();
      await tagModel.insertMany(item.tags);
      const command = new EditItemCommand(item.slug, randomUUID(), {
        tags: { push: ['newTag1'], pull: [item.tags[0].name] },
      });
      // Create eventstore stream
      mockEventStore.existingStreams.add(
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      );
      //ACT
      await commandBus.execute(command);
      // ASSERT
      await retryCallback(async () => {
        // Has new tag been created?
        return (await tagModel.find({})).length === item.tags.length + 1;
      });
      const newTag = await tagModel.findOne({ name: 'newTag1' });
      const oldTag = await tagModel.findOne({ name: item.tags[0].name });
      // Has tag been created?
      expect(newTag).toBeDefined();
      expect(oldTag.count).toEqual(item.tags[0].count - 1);
    });

    it('Should increment totalSuggestions count on item edit suggest', async () => {
      const item = new itemModel(singleItem);
      await item.save();
      mockEventStore.existingStreams.add(
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      );

      const globalStatistic = new globalStatisticsModel({
        totalItems: 1,
        totalSuggestions: 0,
      });
      await globalStatistic.save();

      await request(server)
        .post(commandsPath + `items/${encodeURI(item.slug)}/suggest/edit`)
        .send({ name: 'smthelse' });

      await retryCallback(
        async () => (await editSuggestionModel.count()) !== 0,
      );

      expect((await globalStatisticsModel.findOne()).totalSuggestions).toEqual(
        1,
      );
    });
  });
});
