import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { urlencoded } from 'express';
import { Model } from 'mongoose';
import * as request from 'supertest';
import { ALLOWED_EVENT_ENTITIES } from '../src/eventstore/enums/allowedEntities.enum';
import { EventStore } from '../src/eventstore/eventstore';
import { EventStoreModule } from '../src/eventstore/eventstore.module';
import { ItemCronJobHandler } from '../src/items/cron/items.cron';
import { ItemsModule } from '../src/items/items.module';
import { EditSuggestion } from '../src/models/edit-suggestion.model';
import { Item } from '../src/models/item.model';
import { ItemsByTag } from '../src/models/items-by-tag.model';
import { Profile } from '../src/models/profile.model';
import { Tag } from '../src/models/tag.model';
import { JwtAuthGuard } from '../src/shared/guards/jwt.guard';
import { JwtStrategy } from '../src/shared/strategies/jwt.strategy';
import {
  initializeMockModule,
  teardownMockDataSource,
} from './helpers/MongoMemoryHelpers';
import { retryCallback } from './helpers/retries';
import { timeout } from './helpers/timeout';
import { MockEventStore } from './mocks/eventstore';
import {
  differentNames as itemsWithDifferentNames,
  insertItem,
  insertItem2,
  singleItem,
  singleItemTags,
} from './mocks/items';
import { FakeAuthGuardFactory } from './mocks/jwt-guard.mock';
import { verifiedRequestUser } from './mocks/users';

describe('ItemsController (e2e)', () => {
  let app: INestApplication;
  let itemModel: Model<Item>;
  let tagModel: Model<Tag>;
  let itemsByTagModel: Model<ItemsByTag>;
  let editSuggestionModel: Model<EditSuggestion>;
  let profileModel: Model<Profile>;
  const mockEventStore: MockEventStore = new MockEventStore();
  let itemCronJobHandler: ItemCronJobHandler;
  let server: any; // Has to be any because of supertest not having a type for it either
  const fakeGuard = new FakeAuthGuardFactory();

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
      .useValue(fakeGuard.getGuard())
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
    editSuggestionModel = moduleFixture.get('EditSuggestionModel');
    profileModel = moduleFixture.get('ProfileModel');

    app.setGlobalPrefix('commands/v1');
    await app.init();
    server = app.getHttpServer();

    itemCronJobHandler = app.get<ItemCronJobHandler>(ItemCronJobHandler);

    mockEventStore.eventBus = app.get<EventBus>(EventBus);
  });

  beforeEach(async () => {
    fakeGuard.setAuthResponse(true);
    fakeGuard.setUser(verifiedRequestUser);
    mockEventStore.reset();
    await itemModel.deleteMany();
    await tagModel.deleteMany();
    await itemsByTagModel.deleteMany();
    await editSuggestionModel.deleteMany();
    await profileModel.deleteMany();
  });

  afterAll(async () => {
    await teardownMockDataSource();
    server.close();
    await app.close();
  });

  describe('Commands (POSTS) /commands/v1', () => {
    const commandsPath = '/commands/v1/';

    it('items/insert => insert one Item should fail with auth false', async () => {
      fakeGuard.setAuthResponse(false);
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

      // Check if Item got correct tags count
      expect(item.name).toEqual(insertItem.name);
      expect(item.slug).toBeDefined();
      expect(item.userId).toEqual(1);

      const tag1 = await tagModel.findOne({ name: 'tag1' });
      const tag2 = await tagModel.findOne({ name: 'tag2' });
      expect(tag1.count).toEqual(1);
      expect(tag2.count).toEqual(1);

      const itemsByTag1 = await itemsByTagModel.findOne({ tagName: 'tag1' });
      const itemsByTag2 = await itemsByTagModel.findOne({ tagName: 'tag2' });

      expect(itemsByTag1).toBeDefined();
      expect(itemsByTag1.items.length).toEqual(1);
      expect(itemsByTag1.items[0].tags[0].name).toEqual(tag1.name);
      expect(itemsByTag1.items[0].tags[1].name).toEqual(tag2.name);

      expect(itemsByTag2).toBeDefined();
      expect(itemsByTag2.items.length).toEqual(1);
      expect(itemsByTag2.items[0].tags[0].name).toEqual(tag1.name);
      expect(itemsByTag2.items[0].tags[1].name).toEqual(tag2.name);
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
      expect(item1.tags.length).toEqual(2);
      expect(item2.tags.length).toEqual(1);

      const tag1 = await tagModel.findOne({ name: 'tag1' });
      const tag2 = await tagModel.findOne({ name: 'tag2' });
      expect(tag1.count).toEqual(2);
      expect(tag2.count).toEqual(1);

      const itemsByTag1 = await itemsByTagModel.findOne({ tagName: 'tag1' });
      const itemsByTag2 = await itemsByTagModel.findOne({ tagName: 'tag2' });

      expect(itemsByTag1).toBeDefined();
      expect(itemsByTag1.items.length).toEqual(2);
      expect(itemsByTag1.items[0].tags[0].name).toEqual(tag1.name);
      expect(itemsByTag1.items[0].tags[1].name).toEqual(tag2.name);
      expect(itemsByTag1.items[1].tags[0].name).toEqual(tag1.name);

      expect(itemsByTag2).toBeDefined();
      expect(itemsByTag2.items.length).toEqual(1);
      expect(itemsByTag2.items[0].tags[0].name).toEqual(tag1.name);
      expect(itemsByTag2.items[0].tags[1].name).toEqual(tag2.name);
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
      await timeout(800);
      const items = await itemModel.find({});
      const tag = await tagModel.findOne({ name: 'tag1' });

      expect(items.length).toEqual(itemsWithDifferentNames.length);
      expect(tag.count).toEqual(itemsWithDifferentNames.length);
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
      const updatedItem = await itemModel.findOne({ slug: item.slug });
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

    it('items/:slug/suggest/edit => Should update tags ItemsByTag', async () => {
      // ARRANGE
      const item = new itemModel(singleItem);
      await item.save();
      await tagModel.insertMany(item.tags);
      await itemsByTagModel.insertMany([
        { tagName: singleItem.tags[0].name, items: [item] },
        { tagName: singleItem.tags[1].name, items: [item] },
      ]);
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
        return (
          (await itemsByTagModel.findOne({ tagName: item.tags[0].name })).items
            .length === 0
        );
      });
      const newTag = await itemsByTagModel.findOne({ tagName: 'newTag1' });
      const oldTag = await itemsByTagModel.findOne({
        tagName: item.tags[0].name,
      });
      // Has tag been created?
      expect(newTag).toBeDefined();
      expect(newTag.items[0].slug).toEqual(item.slug);
      expect(oldTag.items.length).toEqual(0);
    });

    it('items/insert => increment profile counts', async () => {
      await request(server)
        .post(commandsPath + 'items/insert')
        .send(insertItem)
        .expect(HttpStatus.OK);

      await timeout();

      const profile = await profileModel.findOne({});
      expect(profile.count.itemsCreated).toEqual(1);
      expect(profile.count.additionalValueOnCreation).toEqual(0);
      expect(profile.count.tagsUsedOnCreation).toEqual(2);
      expect(profile.count.sourceUsedOnCreation).toEqual(0);
      expect(profile.count.imageAddedOnCreation).toEqual(0);
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

  describe('correctAllItemsByTagCounts (CRON)', () => {
    it('Should update ItemsByTag', async () => {
      const item1 = {
        ...singleItem,
        tags: [
          {
            ...singleItem.tags[0],
            count: 2,
          },
          {
            ...singleItem.tags[1],
          },
        ],
      };
      const item2 = {
        ...singleItem,
        name: 'justTest',
        slug: 'justtest',
        tags: [{ ...singleItem.tags[0], count: 2 }],
      };
      // ARRANGE
      await itemModel.insertMany([item1, item2]);
      await tagModel.insertMany(singleItemTags);
      await itemsByTagModel.insertMany([
        {
          tagName: singleItem.tags[0].name,
          items: [
            {
              ...item1,
              tags: [{ ...item1.tags[0], count: 1 }, item1.tags[1]],
            },
            { ...item2, tags: [{ ...item2.tags[0], count: 0 }] },
          ],
        },
        {
          tagName: item1.tags[1].name,
          items: [item1],
        },
      ]);
      // ACT
      await itemCronJobHandler.correctAllItemsByTagCounts();
      // ASSERT
      const firstTag = await itemsByTagModel.findOne({
        tagName: singleItem.tags[0].name,
      });
      expect(firstTag.items.length).toEqual(2);
      expect(firstTag.items[0].tags[0].count).toEqual(2);
      expect(firstTag.items[1].tags[0].count).toEqual(2);
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
    it('Should delete unused Tags from ItemsByTag', async () => {
      // ARRANGE
      await tagModel.insertMany([
        ...singleItemTags,
        { name: 'tobedeleted', count: 0 },
      ]);
      await itemsByTagModel.insertMany([
        {
          tagName: 'tobedeleted',
          items: [],
        },
        {
          tagName: singleItemTags[0].name,
          items: [singleItem],
        },
        {
          tagName: singleItemTags[1].name,
          items: [singleItem],
        },
      ]);
      // ACT
      await itemCronJobHandler.deleteUnusedTags();
      // ASSERT
      // Should now only contain
      const updatedItemsByTags = await itemsByTagModel.find({});
      expect(updatedItemsByTags.length).toEqual(2);
      expect(
        updatedItemsByTags.find((e) => e.tagName === 'tobedeleted'),
      ).toBeUndefined();
    });

    it('Should work even when no changes are needed', async () => {
      // ARRANGE
      await tagModel.insertMany(singleItemTags);
      await itemsByTagModel.insertMany([
        {
          tagName: singleItemTags[0].name,
          items: [singleItem],
        },
        {
          tagName: singleItemTags[1].name,
          items: [singleItem],
        },
      ]);
      // ACT
      await itemCronJobHandler.deleteUnusedTags();
      // ASSERT
      const tags = await tagModel.find({});
      expect(tags.length).toEqual(singleItemTags.length);
      const itemsByTags = await itemsByTagModel.find({});
      expect(itemsByTags.length).toEqual(2);
    });
  });
});
