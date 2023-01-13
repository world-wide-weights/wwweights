import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventStore } from '../src/eventstore/eventstore';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { CommandsModule } from '../src/commands.module/commands.module';
import { Item } from '../src/models/item.model';
import {
  initializeMockDataSource,
  teardownMockDataSource,
} from './helpers/MongoMemoryHelpers';
import { timeout } from './helpers/timeout';
import { MockEventStore } from './mocks/eventstore';
import { Client } from './mocks/eventstore-connection';
import { createItem, singleItem } from './mocks/items';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let itemRepository: any;
  let dataSource: DataSource;
  const client = new Client();

  beforeAll(async () => {
    const dataSource = await initializeMockDataSource();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({ entities: [Item] }),
        CommandsModule,
      ],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .overrideProvider(EventStore)
      .useClass(MockEventStore)
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
