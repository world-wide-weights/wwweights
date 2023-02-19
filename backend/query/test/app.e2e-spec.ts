import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import * as request from 'supertest';
import { AppController } from '../src/app.controller';
import { GlobalStatistics } from '../src/models/global-statistics.model';
import {
  initializeMockModule,
  teardownMockDataSource,
} from './helpers/MongoMemoryHelpers';

describe('App (e2e)', () => {
  let app: INestApplication;
  let globalStatisticsModel: Model<GlobalStatistics>;
  let server: any; // Has to be any because of supertest not having a type for it either

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        initializeMockModule(),
        TypegooseModule.forFeature([GlobalStatistics]),
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

    globalStatisticsModel = moduleFixture.get('GlobalStatisticsModel');

    app.setGlobalPrefix('queries/v1');
    await app.init();
    server = app.getHttpServer();
  });

  beforeEach(async () => {
    await globalStatisticsModel.deleteMany();
  });

  afterAll(async () => {
    await teardownMockDataSource();
    server.close();
    await app.close();
  });

  describe('/queries/v1', () => {
    const queriesPath = '/queries/v1/';

    describe('/statistics', () => {
      const statisticsPath = 'statistics';

      it('should return a GlobalStatistics object', async () => {
        // ARRANGE
        // The upsert is in create item because there can't be suggestions without items so we have to create it in the query tests
        const globalStatistic = new globalStatisticsModel({
          totalItems: 1,
          totalSuggestions: 1,
        });
        await globalStatistic.save();
        // ACT
        const result = await request(server)
          .get(queriesPath + statisticsPath)
          .expect(HttpStatus.OK);

        // ASSERT
        expect(result.body.totalItems).toBe(globalStatistic.totalItems);
        expect(result.body.totalContributions).toBe(
          globalStatistic.totalItems + globalStatistic.totalSuggestions,
        );
      });
    });
  });
});
