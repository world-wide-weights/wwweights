import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CommandsModule } from '../src/commands.module/commands.module';
import {
  closeInMongodConnection,
  rootMongoTestModule,
} from './helpers/MongoMemoryHelpers';
import { timeout } from './helpers/timeout';
import { createItem, singleItem } from './mocks/items';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let itemRepository: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [rootMongoTestModule(), CommandsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    itemRepository = await app.get('ItemRepository');
  });

  beforeEach(async () => {
    await itemRepository.clear();
    await itemRepository.insert(singleItem);
  });

  afterAll(async () => {
    await itemRepository.clear();
    await closeInMongodConnection();
    await Promise.all([app.close()]);
  });

  describe('Commands /commands/', () => {
    const commandsPath = '/commands/';

    it('/ => createItem', async () => {
      await itemRepository.clear();
      await request(app.getHttpServer())
        .post(commandsPath + 'create-item')
        .send(createItem)
        .expect(HttpStatus.OK);

      while ((await itemRepository.count()) < 1) {
        await timeout();
      }

      const item = await itemRepository.findOneBy({ name: createItem.name });
      expect(item.name).toEqual(createItem.name);
      expect(item.slug).toBeDefined();
      expect(item.slug.length).not.toEqual('');
    });
  });
});
