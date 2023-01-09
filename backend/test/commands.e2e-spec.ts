import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CommandsModule } from '../src/commands.module/commands.module';
import { Item } from '../src/models/item.model';
import {
  initializeMockDataSource,
  teardownMockDataSource,
} from './helpers/MongoMemoryHelpers';
import { timeout } from './helpers/timeout';
import { createItem, singleItem } from './mocks/items';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let itemRepository: any;

  beforeAll(async () => {
    const dataSource = await initializeMockDataSource();
    dataSource.manager.getMongoRepository(Item).createCollectionIndexes([
      {
        key: { name: 'text' },
        name: 'text',
        unique: true,
        weights: { name: 1 },
      },
    ]);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypegooseModule.forRoot(''), CommandsModule],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    itemRepository = await dataSource.getMongoRepository(Item);
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

  describe('Commands /command/v1', () => {
    const commandsPath = '/command/v1';

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
