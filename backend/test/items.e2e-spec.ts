import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Item } from '../src/CommandModule/models/item.model';
import { createItem, singleItem } from './items/mock';

describe('AppController (e2e)', () => {
  let app: INestApplication;
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

  //-------------------- Commands(POST) --------------------
  describe('Commands /commands/items', () => {
    const commandsPath = '/commands/items/';

    it('/ => createItem', async () => {
      await itemTable.clear();
      const res = await request(app.getHttpServer())
        .post(commandsPath)
        .send(createItem)
        .expect(HttpStatus.OK);

      expect(res.body).toStrictEqual({}); // Because we don't return in CQRS
      // TODO: how to test if request takes long
      expect(await itemTable.count()).toEqual(1);
      const item = await itemTable.findOneBy({ name: createItem.name });

      expect(item.name).toEqual(createItem.name);
      expect(item.slug).toBeDefined();
      expect(item.slug.length).not.toEqual('');
    });
  });
});
