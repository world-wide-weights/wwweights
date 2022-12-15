import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { setupDataSource } from './helpers/typeOrmSetup';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const dataSource = await setupDataSource();
    const configModuleMock = ConfigModule.forRoot({
      envFilePath: './testing.env',
    });
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .overrideProvider(ConfigModule)
      .useValue(configModuleMock)
      .compile();

    app = await moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/auth/signup (POST)', () => {
    it('Should accept valid DTO (GET)', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          username: 'R2D2',
          password: 'StarWarsIsAVeryNiceMovie',
          email: 'r2d2@jedi.temple',
        })
        .expect(201);
    });
  });

  describe('/auth/login (POST)', () => {
    it('Should fail for incorrect data ', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          password: 'StarWarsIsAVeryNiceMovie',
          email: 'r2d2@jedi.temple',
        })
        .expect(401);
    });
  });
});
