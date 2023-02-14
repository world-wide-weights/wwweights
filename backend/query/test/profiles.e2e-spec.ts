import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Model } from 'mongoose';
import * as request from 'supertest';
import {
  initializeMockModule,
  teardownMockDataSource,
} from './helpers/MongoMemoryHelpers';

import { Test, TestingModule } from '@nestjs/testing';
import { Profile } from '../src/models/profile.model';
import { ProfilesModule } from '../src/profiles/profiles.module';
import { profiles } from './mocks/profiles';

describe('QueryController (e2e)', () => {
  let app: INestApplication;
  let profileModel: Model<Profile>;
  let server: any; // Has to be any because of supertest not having a type for it either

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [initializeMockModule(), ProfilesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    profileModel = moduleFixture.get('ProfileModel');

    app.setGlobalPrefix('queries/v1');
    await app.init();
    server = app.getHttpServer();
  });

  beforeEach(async () => {
    await profileModel.deleteMany();

    await profileModel.insertMany(profiles);
  });

  afterAll(async () => {
    await teardownMockDataSource();
    server.close();
    await app.close();
  });

  describe('Queries /queries/v1', () => {
    const queriesPath = '/queries/v1/';

    describe('profiles/:userId/statistics', () => {
      const subPath = (userId) => `profiles/${userId}/statistics`;

      it('should return the statistics of one profile)', async () => {
        // ACT
        const result = await request(server).get(
          queriesPath + subPath(profiles[0].userId),
        );

        // ASSERT
        expect(result.statusCode).toEqual(HttpStatus.OK);
        expect(result.body.count).toEqual({
          itemsCreated: 1,
          tagsUsedOnCreation: 2,
          sourceUsedOnCreation: 1,
          imageAddedOnCreation: 1,
          additionalValueOnCreation: 0,
        });
      });

      it('should throw a not found if document does not exist )', async () => {
        // ARRANGE
        await profileModel.deleteMany();
        // ACT
        const result = await request(server).get(
          queriesPath + subPath(profiles[0].userId),
        );
        // ASSERT
        expect(result.statusCode).toEqual(HttpStatus.OK);
        expect(result.body).toEqual({});
      });
    });
  });
});
