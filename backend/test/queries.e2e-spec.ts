import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { DataSource, Repository } from 'typeorm';
import { Item } from '../src/models/item.model';
import { ItemsQueriesModule } from '../src/queries.module/queries.module';
import {
  initializeMockDataSource,
  teardownMockDataSource,
} from './helpers/MongoMemoryHelpers';
import { singleItem } from './mocks/items';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let itemRepository: Repository<Item>;

  beforeAll(async () => {
    const dataSource = await initializeMockDataSource();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), ItemsQueriesModule],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    itemRepository = dataSource.getMongoRepository(Item);
  });

  beforeEach(async () => {
    await itemRepository.clear();
    await itemRepository.insert(singleItem);
  });

  afterAll(async () => {
    await itemRepository.clear();
    await teardownMockDataSource();
    await app.close();
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
