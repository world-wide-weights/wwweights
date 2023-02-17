import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { copyFileSync, readdirSync } from 'fs';
import { join } from 'path';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { pathBuilder } from '../src/shared/helpers/file-path.helpers';
import { JwtStrategy } from '../src/shared/strategies/jwt.strategy';
import { UploadService } from '../src/upload/upload.service';
import { emptyDir } from './helpers/file.helper';
import { EmptyLogger } from './mocks/logger.mock';

describe('InternalCommunicationController (e2e)', () => {
  let app: INestApplication;
  let uploadService: UploadService;
  const tmpPath = pathBuilder(undefined, 'tmp');
  const diskPath = pathBuilder(undefined, 'disk');

  beforeAll(async () => {
    process.env.API_KEYS = 'abc';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigModule)
      .useValue(ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }))
      .overrideProvider(JwtStrategy)
      .useValue(null)
      .compile();
    app = moduleFixture.createNestApplication();
    uploadService = app.get<UploadService>(UploadService);
    app.useLogger(new EmptyLogger());
    await app.init();
  });

  beforeEach(async () => {
    await emptyDir(diskPath);
    await emptyDir(tmpPath);
  });

  afterAll(async () => {
    await emptyDir(diskPath);
    await emptyDir(tmpPath);
    await app.close();
  });

  describe('internal/promote-image', () => {
    it('Should promote image from tmp to disk', async () => {
      // ARRANGE
      // Copy file to disk folder
      const imageHash = `${await uploadService.hashFile(
        join(process.cwd(), 'test', 'helpers', 'test.png'),
      )}.png`;
      copyFileSync(
        join(process.cwd(), 'test', 'helpers', 'test.png'),
        join(tmpPath, imageHash),
      );
      // ACT
      const res = await request(app.getHttpServer())
        .post('/internal/promote-image')
        .set('x-api-key', 'abc')
        .send({ imageHash });

      // ASSERT
      expect(res.statusCode).toEqual(HttpStatus.OK);
      expect(readdirSync(tmpPath).length).toEqual(0);
      expect(readdirSync(diskPath).length).toEqual(1);
      expect(readdirSync(diskPath)[0]).toEqual(imageHash);
    });

    it('Should handle already promoted images', async () => {
      // ARRANGE
      // Copy file to disk folder
      const imageHash = `${await uploadService.hashFile(
        join(process.cwd(), 'test', 'helpers', 'test.png'),
      )}.png`;
      copyFileSync(
        join(process.cwd(), 'test', 'helpers', 'test.png'),
        join(tmpPath, imageHash),
      );
      copyFileSync(
        join(process.cwd(), 'test', 'helpers', 'test.png'),
        join(diskPath, imageHash),
      );
      console.log('ready');
      // ACT
      const res = await request(app.getHttpServer())
        .post('/internal/promote-image')
        .set('x-api-key', 'abc')
        .send({ imageHash });
      console.log('res');

      // ASSERT
      // Should return 200 as it is an expected edge case and the sending eventhandler is not meant to handle it
      expect(res.statusCode).toEqual(HttpStatus.OK);
    });

    it('Should handle already deleted images', async () => {
      // ARRANGE
      const imageHash = `${await uploadService.hashFile(
        join(process.cwd(), 'test', 'helpers', 'test.png'),
      )}.png`;
      // ACT
      const res = await request(app.getHttpServer())
        .post('/internal/promote-image')
        .set('x-api-key', 'abc')
        .send({ imageHash });

      // ASSERT
      // Should return 200 as it is an expected edge case and the sending eventhandler is not meant to handle it
      expect(res.statusCode).toEqual(HttpStatus.OK);
    });
  });

  describe('internal/demote-image', () => {
    it('Should demote image', async () => {
      // ARRANGE
      const imageHash = `${await uploadService.hashFile(
        join(process.cwd(), 'test', 'helpers', 'test.png'),
      )}.png`;
      copyFileSync(
        join(process.cwd(), 'test', 'helpers', 'test.png'),
        join(diskPath, imageHash),
      );
      // ACT
      const res = await request(app.getHttpServer())
        .post('/internal/demote-image')
        .set('x-api-key', 'abc')
        .send({ imageHash });
      // ASSERT
      expect(res.statusCode).toEqual(HttpStatus.OK);
      expect(readdirSync(diskPath).length).toEqual(0);
      expect(readdirSync(tmpPath).length).toEqual(1);
    });

    it('Should handle non existant image', async () => {
      // ARRANGE
      const imageHash = `${await uploadService.hashFile(
        join(process.cwd(), 'test', 'helpers', 'test.png'),
      )}.png`;
      // ACT
      const res = await request(app.getHttpServer())
        .post('/internal/demote-image')
        .set('x-api-key', 'abc')
        .send({ imageHash });
      // ASSERT
      expect(res.statusCode).toEqual(HttpStatus.OK);
    });
  });
});
