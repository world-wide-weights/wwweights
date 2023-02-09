import { HttpStatus } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { pathBuilder } from '../src/shared/helpers/file-path.helpers';
import { copyTestFile, emptyDir } from './helpers/file.helper';
import { EmptyLogger } from './mocks/logger.mock';
jest.mock('jwks-rsa', () => ({
  passportJwtSecret: () => {
    return () => 'abc';
  },
}));

describe('Image serve e2e', () => {
  let app;
  const diskPath = pathBuilder(process.env.IMAGE_STORE_BASE_PATH, 'disk');

  beforeAll(async () => {
    await emptyDir(diskPath);
    // Use normal nestjs application because nestjs
    // https://github.com/nestjs/serve-static/issues/240#issuecomment-648100347
    app = await NestFactory.create(AppModule);
    // Make logger shut up
    app.useLogger(new EmptyLogger());
    await app.init();
  });
  
  afterEach(async ()=> {
    await emptyDir(diskPath);
  })

  afterAll(async () => {
    await emptyDir(diskPath);
    await app.close();
  });
  describe('Positive Tests', () => {
    it('Should serve pngs', async () => {
      // ARRANGE
      await copyTestFile(diskPath, 'test.png');
      // ACT
      const res = await request(app.getHttpServer()).get('/serve/test.png');
      // ASSERT
      expect(res.statusCode).toEqual(HttpStatus.OK);
    });
    it('Should serve jpgs', async () => {
      // ARRANGE
      await copyTestFile(diskPath, 'test.jpg');
      // ACT
      const res = await request(app.getHttpServer()).get('/serve/test.jpg');
      // ASSERT
      expect(res.statusCode).toEqual(HttpStatus.OK);
    });
  });
  describe('Negative Tests', () => {
    it('Should fail for file that does not exist', async () => {
      // ACT
      const res = await request(app.getHttpServer()).get('/serve/404.jpg');
      // ASSERT
      expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
    });
    it('Should fail for forbidden file format', async () => {
      // ARRANGE
      await copyTestFile(diskPath, 'test.txt');
      // ACT
      const res = await request(app.getHttpServer()).get('/serve/test.txt');
      // ASSERT
      expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
    });
  });
});
