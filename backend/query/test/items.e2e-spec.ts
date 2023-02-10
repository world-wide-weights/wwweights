import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Model } from 'mongoose';
import * as request from 'supertest';
import { ItemsModule } from '../src/items/items.module';
import { Item } from '../src/items/models/item.model';
import {
  initializeMockModule,
  teardownMockDataSource,
} from './helpers/MongoMemoryHelpers';

import { Test, TestingModule } from '@nestjs/testing';
import { ItemSortEnum } from '../src/items/interfaces/item-sort-enum';
import {
  items,
  itemsWithDates,
  itemsWithDifferentUsers,
  itemsWithImages,
  relatedItems,
} from './mocks/items';

describe('QueryController (e2e)', () => {
  let app: INestApplication;
  let itemModel: Model<Item>;
  let server: any; // Has to be any because of supertest not having a type for it either
  jest.setTimeout(10000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [initializeMockModule(), ItemsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    itemModel = moduleFixture.get('ItemModel');

    app.setGlobalPrefix('queries/v1');
    await app.init();
    server = app.getHttpServer();
  });

  beforeEach(async () => {
    await itemModel.deleteMany();

    await itemModel.insertMany(items);
  });

  afterAll(async () => {
    await itemModel.deleteMany();
    await teardownMockDataSource();
    server.close();
    await app.close();
  });

  describe('Queries /queries/v1', () => {
    const queriesPath = '/queries/v1/';

    describe('items/list', () => {
      const subPath = 'items/list';

      it('should return 16 items searching for android (74 total)', async () => {
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ query: 'android' })
          .expect(HttpStatus.OK);

        expect(result.body.data).toHaveLength(16);
      });

      it('should return 16 items searching for nothing', async () => {
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({})
          .expect(HttpStatus.OK);

        expect(result.body.data).toHaveLength(16);
      });

      it('should return 16 items searching with tags for android (74 total)', async () => {
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ tags: ['android'] })
          .expect(HttpStatus.OK);

        expect(result.body.data).toHaveLength(16);
      });

      it('should not return items if we remove the tags containing android', async () => {
        await itemModel.updateMany({}, { $set: { tags: [] } });

        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ query: 'android' })
          .expect(HttpStatus.OK);

        expect(result.body.data).toHaveLength(0);
      });

      it('should consistently sort by relevance', async () => {
        await itemModel.deleteMany();
        await itemModel.insertMany(relatedItems);
        const results = [];
        for (let i = 0; i < 20; i++) {
          const result = await request(server)
            .get(queriesPath + subPath)
            .query({ query: 'matching 1' })
            .expect(HttpStatus.OK);
          results.push(result.body.data[0]);
        }

        for (const result of results) {
          expect(result.name).toEqual('matching 1');
        }
      });

      it('should consistently return lightest first by same partial name', async () => {
        await itemModel.deleteMany();
        await itemModel.insertMany(relatedItems);
        const results = [];
        for (let i = 0; i < 20; i++) {
          const result = await request(server)
            .get(queriesPath + subPath)
            .query({ query: 'matching', sort: ItemSortEnum.LIGHTEST })
            .expect(HttpStatus.OK);
          results.push(result.body.data[0]);
        }

        for (const result of results) {
          expect(result.weight.value).toEqual(100);
        }
      });

      it('should consistently return heaviest first by same partial name', async () => {
        await itemModel.deleteMany();
        await itemModel.insertMany(relatedItems);
        const results = [];
        for (let i = 0; i < 20; i++) {
          const result = await request(server)
            .get(queriesPath + subPath)
            .query({ query: 'matching', sort: ItemSortEnum.HEAVIEST })
            .expect(HttpStatus.OK);
          results.push(result.body.data[0]);
        }

        for (const result of results) {
          expect(result.weight.value).toEqual(102);
        }
      });

      it('should return one item if searched by slug', async () => {
        await itemModel.deleteMany();
        await itemModel.insertMany(relatedItems);

        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ sort: ItemSortEnum.HEAVIEST, slug: 'matching-1' })
          .expect(HttpStatus.OK);

        expect(result.body.data).toHaveLength(1);
        expect(result.body.data[0].name).toEqual('matching 1');
      });

      it('should return the latest items without any specifications', async () => {
        await itemModel.deleteMany();
        await itemModel.insertMany(itemsWithDates);
        const result = await request(server)
          .get(queriesPath + subPath)
          .expect(HttpStatus.OK);

        expect(result.body.data).toHaveLength(16);
        expect(result.body.data[0].name).toEqual('item 29');
        expect(result.body.data[15].name).toEqual('item 14');
      });

      it('should return the items by a specific user', async () => {
        await itemModel.deleteMany();
        await itemModel.insertMany(itemsWithDifferentUsers);
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ userid: 1 })
          .expect(HttpStatus.OK);
        expect(result.body.data).toHaveLength(
          itemsWithDifferentUsers.length / 2,
        );
      });

      it('should return only items with images', async () => {
        await itemModel.insertMany(itemsWithImages);
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ hasimage: '1' })
          .expect(HttpStatus.OK);

        expect(result.body.data).toHaveLength(itemsWithImages.length);
        for (const item of result.body.data) {
          expect(item.image).toBeDefined();
        }
      });

      it('should return only items without images', async () => {
        await itemModel.deleteMany();
        await itemModel.insertMany(itemsWithImages);
        await itemModel.insertMany(itemsWithDates); // 20 with no images
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ hasimage: '0', limit: 21 })
          .expect(HttpStatus.OK);

        expect(result.body.data).toHaveLength(itemsWithDates.length);
        for (const item of result.body.data) {
          expect(item.images).toBeUndefined();
        }
      });

      it('should return the items with AND without images', async () => {
        await itemModel.deleteMany();
        await itemModel.insertMany(itemsWithImages);
        await itemModel.insertMany(itemsWithDates); // 20 with no images
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ limit: 60 })
          .expect(HttpStatus.OK);

        expect(result.body.data).toHaveLength(
          itemsWithDates.length + itemsWithImages.length,
        );
      });
    });

    describe('items/related', () => {
      const subPath = 'items/related';

      it('should return the related items', async () => {
        await itemModel.deleteMany();
        await itemModel.insertMany(relatedItems);
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ slug: relatedItems[0].slug })
          .expect(HttpStatus.OK);

        const otherItemNames = relatedItems
          .filter((item) => item.slug !== relatedItems[0].slug)
          .map((item) => item.name);

        expect(result.body.data).toHaveLength(2);
        for (const item of result.body.data) {
          expect(otherItemNames).toContain(item.name);
        }
      });

      it('should throw not found if nothing can be found', async () => {
        await itemModel.deleteMany();
        await request(server)
          .get(queriesPath + subPath)
          .query({ slug: relatedItems[0].slug })
          .expect(HttpStatus.NOT_FOUND);
      });
    });

    describe('items/statistics', () => {
      const subPath = 'items/statistics';

      it('should return the proper statistic values', async () => {
        await itemModel.deleteMany();
        await itemModel.insertMany(relatedItems);

        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ query: relatedItems[0].tags[0].name })
          .expect(HttpStatus.OK);

        expect(result.body.heaviest.weight.value).toEqual(102);
        expect(result.body.lightest.weight.value).toEqual(100);
        expect(result.body.averageWeight).toEqual(101);
      });

      it('should throw not found if no item can be found', async () => {
        await itemModel.deleteMany();
        await request(server)
          .get(queriesPath + subPath)
          .query({ slug: relatedItems[0].slug })
          .expect(HttpStatus.NOT_FOUND);
      });
    });
  });
});
