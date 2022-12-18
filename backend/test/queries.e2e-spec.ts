import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { Item } from '../src/models/item.model';
import { QueriesModule } from '../src/queries.module/queries.module';
import {
  closeInMongodConnection,
  rootMongoTestModule,
} from './helpers/MongoMemoryHelpers';
import { singleItem } from './mocks/items';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let itemTable: Repository<Item>;
  jest.setTimeout(30000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [rootMongoTestModule(), QueriesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    itemTable = await app.get('ItemRepository');
  });

  beforeEach(async () => {
    await itemTable.clear();
    await itemTable.insert(singleItem);
  });

  afterAll(async () => {
    await itemTable.clear();
    await closeInMongodConnection();
    await Promise.all([app.close()]);
  });

  describe('Queries /queries/', () => {
    const queriesPath = '/queries/';

    it('/:slug => getOneItem', async () => {
      const res = await request(app.getHttpServer())
        .get(queriesPath + 'get-one-item/' + singleItem.slug)
        .expect(HttpStatus.OK);
      expect(res.body.name).toBe(singleItem.name);
    });
  });
});
