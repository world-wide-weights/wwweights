import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { ItemsCommandsModule } from '../src/commands.module/commands.module';
import { Item } from '../src/models/item.model';
import { rootMongoTestModule } from './helpers/MongoMemoryHelpers';
import { singleItem } from './mocks/items';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let itemTable: Repository<Item>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [rootMongoTestModule(), ItemsCommandsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    // TODO: Not sure if this is any practice at all , but it works
    itemTable = await app.get('ItemRepository');
  });

  beforeEach(async () => {
    await itemTable.clear();
    await itemTable.insert(singleItem);
  });

  afterAll(async () => {
    await itemTable.clear();
    await Promise.all([app.close()]);
  });

  describe('Queries /queries/items', () => {
    const queriesPath = '/queries/items/';

    it('/ => getItems', async () => {
      const res = await request(app.getHttpServer())
        .get(queriesPath)
        .expect(HttpStatus.OK);
      expect(res.body.length).toEqual(1);
      // const { _id, ...item } = res.body[0];
      // const { _id, ...compareItem } = singleItem;
      console.log(singleItem);
      expect(res.body[0]).toStrictEqual(singleItem);
    });

    it('/:slug => getItem', async () => {
      const res = await request(app.getHttpServer())
        .get(`${queriesPath}${singleItem.slug}`)
        .expect(HttpStatus.OK);
      expect(res.body.name).toBe(singleItem.name);
    });
  });
});
