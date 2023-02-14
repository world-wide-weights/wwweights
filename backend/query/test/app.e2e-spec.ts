import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import * as request from 'supertest';
import { AppController } from '../src/app.controller';
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
      // Importing everything here because it was the most straightforward way found to prevent the openHandlesIssue
      imports: [
        initializeMockModule(),
        TypegooseModule.forFeature([EditSuggestion, Item]),
      ],
      controllers: [AppController],
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

    app.setGlobalPrefix('queries/v1');
    await app.init();
    server = app.getHttpServer();
  });

  beforeEach(async () => {
    await itemModel.deleteMany();
    await editSuggestionModel.deleteMany();
    await itemModel.insertMany(items);
    await editSuggestionModel.insertMany(suggestions);
  });

  afterAll(async () => {
    await teardownMockDataSource();
    server.close();
    await app.close();
  });

  describe('App /', () => {
    const queriesPath = '/queries/v1/';

    describe('statistics', () => {
      const subPath = 'statistics';

      it('should return a GlobalStatistics object', async () => {
        const result = await request(server)
          .get(queriesPath + subPath)
          .expect(HttpStatus.OK);

        expect(result.body.totalItems).toBe(items.length);
        expect(result.body.totalContributions).toBe(
          items.length + suggestions.length,
        );
      });
    });
  });
});
