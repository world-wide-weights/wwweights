import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const itemsPath = '/items';
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get(itemsPath)
      .expect(HttpStatus.OK)
      .expect({});
  });

  it('/ (CREATE)', () => {
    return request(app.getHttpServer())
      .post(itemsPath)
      .send({
        name: 'test Name with SpAcEs ',
        weight: 'ca. 1kg',
        tags: ['testTag', 'testTag2'],
        user: 'testUser',
        isActive: true,
      })
      .expect(HttpStatus.CREATED);
  });
});
