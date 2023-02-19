import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Model } from 'mongoose';
import * as request from 'supertest';
import { Tag } from '../src/models/tag.model';
import {
  initializeMockModule,
  teardownMockDataSource,
} from './helpers/MongoMemoryHelpers';

import { Test, TestingModule } from '@nestjs/testing';
import { Item } from '../src/models/item.model';
import { TagsModule } from '../src/tags/tags.module';
import { getItemsTagCount, items } from './mocks/items';
import { tags } from './mocks/tags';

describe('Tags (e2e)', () => {
  let app: INestApplication;
  let tagModel: Model<Tag>;
  let itemModel: Model<Item>;
  let server: any; // Has to be any because of supertest not having a type for it either

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [initializeMockModule(), TagsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    tagModel = moduleFixture.get('TagModel');
    itemModel = moduleFixture.get('ItemModel');

    app.setGlobalPrefix('queries/v1');
    await app.init();
    server = app.getHttpServer();
  });

  beforeEach(async () => {
    await tagModel.deleteMany();
    await itemModel.deleteMany();

    await itemModel.insertMany(items);
    await tagModel.insertMany(tags);
  });

  afterAll(async () => {
    await teardownMockDataSource();
    server.close();
    await app.close();
  });

  describe('Queries /queries/v1', () => {
    const queriesPath = '/queries/v1/';

    describe('tags/list', () => {
      const subPath = 'tags/list';

      it('should return the alphabetical first 5', async () => {
        // ACT
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ limit: 5 })
          .expect(HttpStatus.OK);

        // ASSERT
        expect(result.body.data[0].name).toEqual(tags[0].name);
        expect(result.body.data[4].name).toEqual(tags[4].name);
      });

      it('should return the alphabetical last 5', async () => {
        // ACT
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ limit: 5, sort: 'desc' })
          .expect(HttpStatus.OK);

        // ASSERT
        expect(result.body.data[4].name).toEqual(tags[0].name);
        expect(result.body.data[0].name).toEqual(tags[4].name);
      });

      it('should return the 5 most used', async () => {
        // ACT
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ limit: 5, sort: 'most-used' })
          .expect(HttpStatus.OK);

        // ASSERT
        expect(result.body.data[0].name).toEqual(tags[2].name);
      });
    });

    describe('tags/related', () => {
      const subPath = 'tags/related';

      it('should find list of tags when querying "android"', async () => {
        // ACT
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ query: 'android' })
          .expect(HttpStatus.OK);

        // ASSERT
        expect(result.body.data).toHaveLength(16);
        for (const tag of result.body.data) {
          expect(tag).toHaveProperty('relevance');
          expect(tag.relevance).toBeLessThan(100);
          expect(tag).toHaveProperty('name');
          expect(tag).toHaveProperty('count');
        }
      });

      it('should find most relevance tag "smartphone" when querying "android"', async () => {
        // ACT
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ query: 'android' })
          .expect(HttpStatus.OK);

        // ASSERT
        expect(result.body.data[0].name).toEqual('smartphone');
      });

      it('should return base results if query is empty', async () => {
        // ACT
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({})
          .expect(HttpStatus.OK);

        // ASSERT
        expect(result.body.data).toHaveLength(16);
        expect(result.body.total).toBe(getItemsTagCount());
        expect(result.body.limit).toBe(16);
        expect(result.body.page).toBe(1);
        for (const tag of result.body.data) {
          expect(tag.relevance).toBeLessThan(100);
        }
      });

      it('should not contain data if db is empty', async () => {
        // ARRANGE
        await itemModel.deleteMany();

        // ACT
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({})
          .expect(HttpStatus.OK);

        // ASSERT
        expect(result.body.total).toBe(0);
        expect(result.body.data).toHaveLength(0);
      });

      it('should not return android tag if querytag contains android', async () => {
        // ACT
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ query: 'android', tags: ['android'] })
          .expect(HttpStatus.OK);

        // ASSERT
        for (const tag of result.body.data) {
          expect(tag.name).not.toBe('android');
        }
      });

      it('should return decending relevance', async () => {
        // ACT
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ query: 'android', tags: ['android'] })
          .expect(HttpStatus.OK);

        // ASSERT
        expect(result.body.data[0].relevance).toBeGreaterThan(
          result.body.data.at(-1).relevance,
        );
      });
    });
  });
});
