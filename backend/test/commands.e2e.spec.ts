import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { ItemsCommandsModule } from '../src/commands.module/commands.module';
import { Item } from '../src/models/item.model';
import { rootMongoTestModule } from './helpers/MongoMemoryHelpers';
import { createItem, singleItem } from './mocks/items';

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
