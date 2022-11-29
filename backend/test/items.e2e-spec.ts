import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Item } from '../src/items/models/item.model';
import { createItem, singleItem } from './items/mock';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const itemsPath = '/items/';
  let itemTable: Repository<Item>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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

  //--------------------- Queries(GET) ---------------------

  describe('Queries /items', () => {
    it('/ => getItems', async () => {
      const res = await request(app.getHttpServer())
        .get(itemsPath)
        .expect(HttpStatus.OK);
      expect(res.body.length).toEqual(1);
      expect(res.body[0]).toEqual(singleItem);
    });

    it('/:slug => getItem', async () => {
      const res = await request(app.getHttpServer())
        .get(`${itemsPath}${singleItem.slug}`)
        .expect(HttpStatus.OK);
      expect(res.body.name).toBe(singleItem.name);
    });
  });

  //-------------------- Commands(POST) --------------------

  describe('Commands /items', () => {
    it('/ => createItem', async () => {
      await itemTable.clear();
      const res = await request(app.getHttpServer())
        .post(itemsPath)
        .send(createItem)
        .expect(HttpStatus.CREATED);

      expect(res.body).toStrictEqual({}); // Because we don't return in CQRS
      expect(await itemTable.count()).toEqual(1);
      const item = await itemTable.findOneBy({ name: createItem.name });

      expect(item.name).toEqual(createItem.name);
      expect(item.slug).toBeDefined();
      expect(item.slug.length).not.toEqual('');
    });
  });
});
