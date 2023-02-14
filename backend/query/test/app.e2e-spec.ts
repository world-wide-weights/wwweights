import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import * as request from 'supertest';
import { setTimeout } from 'timers/promises';
import { AppModule } from '../src/app.module';
import { EditSuggestion } from '../src/models/edit-suggestion.model';
import { Item } from '../src/models/item.model';
import {
  initializeMockModule,
  teardownMockDataSource,
} from './helpers/MongoMemoryHelpers';
import { items } from './mocks/items';
import { suggestions } from './mocks/suggestions';

describe('QueryController (e2e)', () => {
  let app: INestApplication;
  let itemModel: Model<Item>;
  let editSuggestionModel: Model<EditSuggestion>;

  let server: any; // Has to be any because of supertest not having a type for it either

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [initializeMockModule(), AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    itemModel = moduleFixture.get('ItemModel');
    editSuggestionModel = moduleFixture.get('EditSuggestionModel');

    await app.init();
    server = app.getHttpServer();
    // This is to make sure the db setup is completed aswell
    await setTimeout(100);
  });

  beforeEach(async () => {
    await itemModel.deleteMany();
    await editSuggestionModel.deleteMany();
    await itemModel.insertMany(items);
    await editSuggestionModel.insertMany(suggestions);
  });

  afterAll(async () => {
    await itemModel.deleteMany();
    await teardownMockDataSource();
    server.close();
    await app.close();
  });

  describe('App /', () => {
    const queriesPath = '/queries/v1/';
    const subPath = 'statistics';

    it('should return a GlobalStatistics object', async () => {
      const result = await request(server)
        .get(queriesPath + subPath)
        .expect(HttpStatus.OK);

      expect(result.body.data.totalItems).toBe(items.length);
      expect(result.body.data.totalContributions).toBe(
        items.length + suggestions.length,
      );
    });
  });
});
