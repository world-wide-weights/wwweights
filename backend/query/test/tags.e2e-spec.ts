import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Model } from 'mongoose';
import * as request from 'supertest';
import { ItemsModule } from '../src/items/items.module';
import { Tag } from '../src/tags/models/tag.model';
import {
  initializeMockModule,
  teardownMockDataSource,
} from './helpers/MongoMemoryHelpers';

import { Test, TestingModule } from '@nestjs/testing';
import { tags } from './mocks/tags';

describe('QueryController (e2e)', () => {
  let app: INestApplication;
  let tagModel: Model<Tag>;
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

    tagModel = moduleFixture.get('TagModel');

    app.setGlobalPrefix('queries/v1');
    await app.init();
    server = app.getHttpServer();
  });

  beforeEach(async () => {
    await tagModel.deleteMany();

    await tagModel.insertMany(tags);
  });

  afterAll(async () => {
    await tagModel.deleteMany();
    await teardownMockDataSource();
    server.close();
    await app.close();
  });

  describe('Queries /queries/v1', () => {
    const queriesPath = '/queries/v1/';

    describe('tags/list', () => {
      const subPath = 'tags/list';

      it('should return the alphabetical first 5)', async () => {
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ limit: 5, query: 'android' })
          .expect(HttpStatus.NOT_IMPLEMENTED);
      });

      it('should return the alphabetical last 5)', async () => {
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ limit: 5, query: 'android' })
          .expect(HttpStatus.NOT_IMPLEMENTED);
      });

      it('should return the 5 most used)', async () => {
        const result = await request(server)
          .get(queriesPath + subPath)
          .query({ limit: 5, query: 'android' })
          .expect(HttpStatus.NOT_IMPLEMENTED);
      });
    });

    // describe('tags/related', () => {
    //   const subPath = 'tags/related';

    //   it('should return the related items', async () => {
    //     const result = await request(server)
    //       .get(queriesPath + subPath)
    //       .query({ slug: relatedItems[0].slug })
    //       .expect(HttpStatus.NOT_IMPLEMENTED);

    //     const otherItemNames = relatedItems
    //       .filter((item) => item.slug !== relatedItems[0].slug)
    //       .map((item) => item.name);

    //     expect(result.body.data).toHaveLength(2);
    //     for (const item of result.body.data) {
    //       expect(otherItemNames).toContain(item.name);
    //     }
    //   });
    // });
  });
});
