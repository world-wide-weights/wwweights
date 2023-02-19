import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import * as request from 'supertest';
import { setTimeout } from 'timers/promises';
import { ItemSortEnum } from '../src/items/enums/item-sort-enum';
import { ItemsModule } from '../src/items/items.module';
import { Item } from '../src/models/item.model';
import {
  initializeMockModule,
  teardownMockDataSource,
} from './helpers/MongoMemoryHelpers';
import {
  items,
  itemsWithAdditonalWeight,
  itemsWithDates,
  itemsWithDifferentUsers,
  itemsWithImages,
  relatedItems,
} from './mocks/items';

describe('Items (e2e)', () => {
  let app: INestApplication;
  let itemModel: Model<Item>;
  let server: any; // Has to be any because of supertest not having a type for it either

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
    // This is to make sure the db setup is completed aswell
    await setTimeout(100);
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

  describe('/queries/v1', () => {
    const queriesPath = '/queries/v1/';

    describe('items/list', () => {
      const subPath = 'items/list';

      it('should return 16 items searching for android (74 total)', async () => {
        // ACT
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ query: 'android' })
          .expect(HttpStatus.OK);
        // ASSERT
        expect(result.body.data).toHaveLength(16);
      });

      it('should return 16 items searching for nothing', async () => {
        // ACT
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({})
          .expect(HttpStatus.OK);

        // ASSERT
        expect(result.body.data).toHaveLength(16);
      });

      it('should return 16 items searching with tags for android (74 total)', async () => {
        // ACT
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ tags: ['android'] })
          .expect(HttpStatus.OK);

        // ASSERT
        expect(result.body.data).toHaveLength(16);
      });

      it('should not return items if we remove the tags containing android', async () => {
        // ARRANGE
        await itemModel.updateMany({}, { $set: { tags: [] } });

        // ACT
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ query: 'android' })
          .expect(HttpStatus.OK);

        // ASSERT
        expect(result.body.data).toHaveLength(0);
      });

      it('should consistently sort by relevance', async () => {
        // ARRANGE
        await itemModel.deleteMany();
        await itemModel.insertMany(relatedItems);
        const results = [];

        // ACT
        for (let i = 0; i < 20; i++) {
          const result = await request(server)
            .get(queriesPath + subPath)
            .query({ query: 'matching 1' })
            .expect(HttpStatus.OK);
          results.push(result.body.data[0]);
        }

        // ASSERT
        for (const result of results) {
          expect(result.name).toEqual('matching 1');
        }
      });

      // This test was created due to a bug where the sort was not consistent but worked 4/5 times
      it('should consistently return lightest first by same partial name', async () => {
        // ARRANGE
        await itemModel.deleteMany();
        await itemModel.insertMany(relatedItems);
        const results = [];

        // ACT
        for (let i = 0; i < 20; i++) {
          const result = await request(server)
            .get(queriesPath + subPath)
            .query({ query: 'matching', sort: ItemSortEnum.LIGHTEST })
            .expect(HttpStatus.OK);
          results.push(result.body.data[0]);
        }

        // ASSERT
        for (const result of results) {
          expect(result.weight.value).toEqual(100);
        }
      });

      // This test was created due to a bug where the sort was not consistent but worked 4/5 times
      it('should consistently return heaviest first by same partial name', async () => {
        // ARRANGE
        await itemModel.deleteMany();
        await itemModel.insertMany(relatedItems);
        const results = [];

        // ACT
        for (let i = 0; i < 20; i++) {
          const result = await request(server)
            .get(queriesPath + subPath)
            .query({ query: 'matching', sort: ItemSortEnum.HEAVIEST })
            .expect(HttpStatus.OK);
          results.push(result.body.data[0]);
        }

        // ASSERT
        for (const result of results) {
          expect(result.weight.value).toEqual(102);
        }
      });

      it('should return one item if searched by slug', async () => {
        // ARRANGE
        await itemModel.deleteMany();
        await itemModel.insertMany(relatedItems);

        // ACT
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ sort: ItemSortEnum.HEAVIEST, slug: 'matching-1' })
          .expect(HttpStatus.OK);

        // ASSERT
        expect(result.body.data).toHaveLength(1);
        expect(result.body.data[0].name).toEqual('matching 1');
      });

      it('should return the latest items without any specifications', async () => {
        // ARRANGE
        await itemModel.deleteMany();
        await itemModel.insertMany(itemsWithDates);

        // ACT
        const result = await request(server)
          .get(queriesPath + subPath)
          .expect(HttpStatus.OK);

        // ASSERT
        expect(result.body.data).toHaveLength(16);
        expect(result.body.data[0].name).toEqual('item 29');
        expect(result.body.data[15].name).toEqual('item 14');
      });

      it('should return the items by a specific user', async () => {
        // ARRANGE
        await itemModel.deleteMany();
        await itemModel.insertMany(itemsWithDifferentUsers);

        // ACT
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ userid: 1 })
          .expect(HttpStatus.OK);

        // ASSERT
        expect(result.body.data).toHaveLength(
          itemsWithDifferentUsers.length / 2,
        );
      });

      it('should return only items with images', async () => {
        // ARRANGE
        await itemModel.insertMany(itemsWithImages);

        // ACT
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ hasimage: '1' })
          .expect(HttpStatus.OK);

        // ASSERT
        expect(result.body.data).toHaveLength(itemsWithImages.length);
        for (const item of result.body.data) {
          expect(item.image).toBeDefined();
        }
      });

      it('should return only items without images', async () => {
        // ARRANGE
        await itemModel.deleteMany();
        await itemModel.insertMany(itemsWithImages);
        await itemModel.insertMany(itemsWithDates); // 20 with no images

        // ACT
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ hasimage: '0', limit: 21, page: 1 })
          .expect(HttpStatus.OK);

        // ASSERT
        expect(result.body.data).toHaveLength(itemsWithDates.length);
        for (const item of result.body.data) {
          expect(item.images).toBeUndefined();
        }
      });

      it('should return the items with AND without images', async () => {
        // ARRANGE
        await itemModel.deleteMany();
        await itemModel.insertMany(itemsWithImages);
        await itemModel.insertMany(itemsWithDates); // 20 with no images

        // ACT
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ limit: 60 })
          .expect(HttpStatus.OK);

        // ASSERT
        expect(result.body.data).toHaveLength(
          itemsWithDates.length + itemsWithImages.length,
        );
      });
    });

    describe('items/related', () => {
      const subPath = 'items/related';

      it('should return the related items of one item', async () => {
        // ARRANGE
        await itemModel.deleteMany();
        await itemModel.insertMany(relatedItems);

        // ACT
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ slug: relatedItems[0].slug })
          .expect(HttpStatus.OK);

        const otherItemNames = relatedItems
          .filter((item) => item.slug !== relatedItems[0].slug)
          .map((item) => item.name);

        // ASSERT
        expect(result.body.data).toHaveLength(2);
        for (const item of result.body.data) {
          expect(otherItemNames).toContain(item.name);
        }
      });

      it('should throw not found if slug cannot be found', async () => {
        // ARRANGE
        await itemModel.deleteMany();

        // ACT & ASSERT
        await request(server)
          .get(queriesPath + subPath)
          .query({ slug: relatedItems[0].slug })
          .expect(HttpStatus.NOT_FOUND);
      });
    });

    describe('items/statistics', () => {
      const subPath = 'items/statistics';

      it('should return the proper statistic values', async () => {
        // ARRANGE
        await itemModel.deleteMany();
        await itemModel.insertMany(relatedItems);

        // ACT
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ query: relatedItems[0].tags[0].name })
          .expect(HttpStatus.OK);

        // ASSERT
        expect(result.body.heaviest.weight.value).toEqual(102);
        expect(result.body.lightest.weight.value).toEqual(100);
        expect(result.body.averageWeight).toEqual(101);
      });

      it('should throw not found if no item can be found', async () => {
        // ARRANGE
        await itemModel.deleteMany();

        // ACT & ASSERT
        await request(server)
          .get(queriesPath + subPath)
          .query({ query: relatedItems[0].tags[0].name })
          .expect(HttpStatus.NOT_FOUND);
      });

      it('should return the average as the middle between value and additionalValue', async () => {
        // ARRANGE
        await itemModel.deleteMany();
        await itemModel.insertMany(itemsWithAdditonalWeight);

        // ACT
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ query: relatedItems[0].tags[0].name })
          .expect(HttpStatus.OK);

        // ASSERT
        expect(result.body.heaviest.weight.additionalValue).toEqual(
          itemsWithAdditonalWeight[0].weight.additionalValue,
        );
        expect(result.body.lightest.weight.value).toEqual(
          itemsWithAdditonalWeight[0].weight.value,
        );
        expect(result.body.averageWeight).toEqual(
          ((itemsWithAdditonalWeight[0].weight.additionalValue +
            itemsWithAdditonalWeight[0].weight.value) /
            2 +
            itemsWithAdditonalWeight[1].weight.value) /
            2,
        );
      });
    });
  });
});
