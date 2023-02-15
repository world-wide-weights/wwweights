import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import * as request from 'supertest';
import { ALLOWED_EVENT_ENTITIES } from '../src/eventstore/enums/allowedEntities.enum';
import { EventStore } from '../src/eventstore/eventstore';
import { EventStoreModule } from '../src/eventstore/eventstore.module';
import { ItemCronJobHandler } from '../src/items/cron/items.cron';
import { ItemsModule } from '../src/items/items.module';
import { DeleteSuggestion } from '../src/models/delete-suggestion.model';
import { EditSuggestion } from '../src/models/edit-suggestion.model';
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
import { retryCallback } from './helpers/retries';
import { FakeEnvGuardFactory } from './mocks/env-guard.mock';
import { MockEventStore } from './mocks/eventstore';
import {
  differentNames as itemsWithDifferentNames,
  insertItem,
  insertItem2,
  singleItem,
  singleItemTags,
  testData,
} from './mocks/items';
import { FakeAuthGuardFactory } from './mocks/jwt-guard.mock';
import { verifiedRequestUser } from './mocks/users';

describe('ItemsController (e2e)', () => {
  let app: INestApplication;
  let itemModel: Model<Item>;
  let tagModel: Model<Tag>;
  let editSuggestionModel: Model<EditSuggestion>;
  let profileModel: Model<Profile>;
  let deleteSuggestionModel: Model<DeleteSuggestion>;
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
        ItemsModule,
        EventStoreModule,
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
  });

  afterAll(async () => {
    await teardownMockDataSource();
    server.close();
    await app.close();
  });

  const commandsPath = '/commands/v1/';

  describe('Commands (POSTS) /commands/v1', () => {
    it('items/insert => insert one Item should fail with auth false', async () => {
      fakeJWTGuard.setAuthResponse(false);
      await request(server)
        .post(commandsPath + 'items/insert')
        .send(insertItem)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('items/insert => insert one Item', async () => {
      await request(server)
        .post(commandsPath + 'items/insert')
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

      return;
    });

    it('items/insert => insert two Items', async () => {
      await request(server)
        .post(commandsPath + 'items/insert')
        .send(insertItem)
        .expect(HttpStatus.OK);
      await retryCallback(async () => (await itemModel.count()) === 1);
      await request(server)
        .post(commandsPath + 'items/insert')
        .send(insertItem2)
        .expect(HttpStatus.OK);

      await retryCallback(
        async () => (await tagModel.findOne({ name: 'tag1' })).count === 2,
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
      itemsWithDifferentNames.forEach(async (name) => {
        await request(server)
          .post(commandsPath + 'items/insert')
          .send({ ...insertItem2, name })
          .expect(HttpStatus.OK);
      });
      await retryCallback(
        async () =>
          (await itemModel.findOne({ slug: itemsWithDifferentNames[-1] })) !==
          undefined,
      );
      const items = await itemModel.find({});
      const tag = await tagModel.findOne({ name: 'tag1' });

      expect(items.length).toEqual(itemsWithDifferentNames.length);
      expect(tag.count).toEqual(itemsWithDifferentNames.length);
    });

    it('items/insert => increment profile counts', async () => {
      await request(server)
        .post(commandsPath + 'items/insert')
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

    it('items/:slug/suggest/edit => Should create a suggestion', async () => {
      // ARRANGE
      const item = new itemModel(singleItem);
      await item.save();
      // Create eventstore stream
      mockEventStore.existingStreams = [
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      ];
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
      expect(mockEventStore.existingStreams.length).toEqual(2);
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
      mockEventStore.existingStreams = [
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      ];
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

    // WARNING: The following tests are for testing the edit functionality itself. As of now this is triggered via the
    // suggestion request, however this is subject to change. These tests are more relevant for grading than functionality

    it('items/:slug/suggest/edit => Should update item', async () => {
      // ARRANGE
      const item = new itemModel(singleItem);
      await item.save();
      // Create eventstore stream
      mockEventStore.existingStreams = [
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      ];
      //ACT
      const res = await request(server)
        .post(commandsPath + `items/${item.slug}/suggest/edit`)
        .send({ image: 'test' });
      // ASSERT
      expect(res.status).toEqual(HttpStatus.OK);
      // This will pass if met or throw an error if callback condition is never met
      await retryCallback(
        async () =>
          // Has item been updated?
          (await itemModel.findOne({ slug: item.slug })).image === 'test',
      );
    });

    it('items/:slug/suggest/edit => Should be able to set property to null', async () => {
      // ARRANGE
      const item = new itemModel(singleItem);
      await item.save();
      // Create eventstore stream
      mockEventStore.existingStreams = [
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      ];
      //ACT
      const res = await request(server)
        .post(commandsPath + `items/${item.slug}/suggest/edit`)
        .send({ source: null });
      // ASSERT
      expect(res.status).toEqual(HttpStatus.OK);
      // This will pass if met or throw an error if callback condition is never met
      await retryCallback(
        async () =>
          // Has item been updated?
          (await itemModel.findOne({ slug: item.slug })).source === null,
      );
    });

    it('items/:slug/suggest/edit => Should be able to update weight (nested Object)', async () => {
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
      // Create eventstore stream
      mockEventStore.existingStreams = [
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      ];
      //ACT
      const updateWeight = {
        value: 2222222e30,
      };
      const res = await request(server)
        .post(commandsPath + `items/${item.slug}/suggest/edit`)
        .send({ weight: updateWeight });
      // ASSERT
      expect(res.status).toEqual(HttpStatus.OK);
      // This will pass if met or throw an error if callback condition is never met
      await retryCallback(
        async () =>
          // Has item been updated?
          (await itemModel.findOne({ slug: item.slug })).weight.value ===
          updateWeight.value,
      );
      const updatedItem = await itemModel.findOne({ slug: item.slug }).lean();
      expect(updatedItem.weight).toEqual({
        value: updateWeight.value,
        isCa: item.weight.isCa,
        additionalValue: item.weight.additionalValue,
      });
    });

    it('items/:slug/suggest/edit => Should be able to remove fields in weight (nested Object)', async () => {
      // ARRANGE
      const item = new itemModel({
        ...singleItem,
        weight: { value: 1123675e30, isCa: true },
      });
      await item.save();
      // Create eventstore stream
      mockEventStore.existingStreams = [
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      ];
      //ACT
      const updateWeight = {
        value: 2222222e30,
        isCa: null,
      };
      const res = await request(server)
        .post(commandsPath + `items/${item.slug}/suggest/edit`)
        .send({ weight: updateWeight });
      // ASSERT
      expect(res.status).toEqual(HttpStatus.OK);
      // This will pass if met or throw an error if callback condition is never met
      await retryCallback(
        async () =>
          // Has item been updated?
          (await itemModel.findOne({ slug: item.slug })).weight.value ===
          updateWeight.value,
      );
      const updatedItem = await itemModel.findOne({ slug: item.slug });
      // Weight check is redundant with callback
      expect(updatedItem.weight.isCa).toBeNull();
    });

    it('items/:slug/suggest/edit => Should update tags in item', async () => {
      // ARRANGE
      const item = new itemModel(singleItem);
      await item.save();
      // Create eventstore stream
      mockEventStore.existingStreams = [
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      ];
      //ACT
      const res = await request(server)
        .post(commandsPath + `items/${item.slug}/suggest/edit`)
        .send({
          tags: { push: ['newTag1'], pull: [item.tags[0].name] },
        });
      // ASSERT
      expect(res.status).toEqual(HttpStatus.OK);
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

    it('items/:slug/suggest/edit => Should update tags in Tags', async () => {
      // ARRANGE
      const item = new itemModel(singleItem);
      await item.save();
      await tagModel.insertMany(item.tags);
      // Create eventstore stream
      mockEventStore.existingStreams = [
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      ];
      //ACT
      const res = await request(server)
        .post(commandsPath + `items/${item.slug}/suggest/edit`)
        .send({
          tags: { push: ['newTag1'], pull: [item.tags[0].name] },
        });
      // ASSERT
      expect(res.status).toEqual(HttpStatus.OK);
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

    it('items/:slug/suggest/delete => Should add delete suggestion', async () => {
      // ARRANGE
      const item = new itemModel(singleItem);
      await item.save();
      // Create eventstore stream
      mockEventStore.existingStreams = [
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      ];
      //ACT
      const res = await request(server)
        .post(commandsPath + `items/${item.slug}/suggest/delete`)
        .send({ reason: 'test' });
      // ASSERT
      expect(res.status).toEqual(HttpStatus.OK);
      const suggestions = await deleteSuggestionModel.find({});
      expect(suggestions.length).toEqual(1);
      expect(suggestions[0].reason).toEqual('test');
    });

    it('items/:slug/suggest/delete => Should delete item', async () => {
      // ARRANGE
      const item = new itemModel(singleItem);
      await item.save();
      // Create eventstore stream
      mockEventStore.existingStreams = [
        `${ALLOWED_EVENT_ENTITIES.ITEM}-${item.slug}`,
      ];
      //ACT
      const res = await request(server)
        .post(commandsPath + `items/${item.slug}/suggest/delete`)
        .send({ reason: 'test' });
      // ASSERT
      expect(res.status).toEqual(HttpStatus.OK);
      await retryCallback(
        async () => !(await itemModel.findOne({ slug: item.slug })),
      );
      // Does suggestion exist in mongoDb
      const items = await itemModel.find({});
      expect(items.length).toEqual(0);
    });
  });

  describe('Dev commands (POSTS) /commands/v1', () => {
    it('items/bulk-insert => Should be hidden if env guard fails', async () => {
      // ACT
      const res = await request(server)
        .post(commandsPath + 'items/bulk-insert')
        .send(testData.slice(0, 5));
      // ASSERT
      expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it('items/bulk-insert => Should insert multiple items', async () => {
      // ARRANGE
      fakeEnvGuard.isDev = true;
      // ACT
      const res = await request(server)
        .post(commandsPath + 'items/bulk-insert')
        .send(testData.slice(0, 5));
      // ASSERT
      expect(res.status).toEqual(HttpStatus.OK);
      await retryCallback(async () => (await itemModel.find({})).length !== 0);
      const items = await itemModel.find({});
      expect(items.length).toEqual(5);
    });

    it('items/bulk-insert => Should allow to set userId', async () => {
      // ARRANGE
      fakeEnvGuard.isDev = true;
      const userId = 12;
      const insertItems = testData
        .slice(0, 5)
        .map((e) => ({ ...e, userId: userId }));
      // ACT
      const res = await request(server)
        .post(commandsPath + 'items/bulk-insert')
        .send(insertItems);
      // ASSERT
      expect(res.status).toEqual(HttpStatus.OK);
      await retryCallback(async () => (await itemModel.find({})).length !== 0);
      const items = await itemModel.find({});
      for (const item of items) {
        expect(item.userId).toEqual(userId);
      }
    });

    it('items/bulk-insert => Should default to userId of 0', async () => {
      // ARRANGE
      fakeEnvGuard.isDev = true;
      // ACT
      const res = await request(server)
        .post(commandsPath + 'items/bulk-insert')
        .send(testData.slice(0, 5));
      // ASSERT
      expect(res.status).toEqual(HttpStatus.OK);
      await retryCallback(async () => (await itemModel.find({})).length !== 0);
      const items = await itemModel.find({});
      for (const item of items) {
        expect(item.userId).toEqual(0);
      }
    });
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
