import { HttpService } from '@nestjs/axios';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { copyFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/shared/guards/jwt.guard';
import { pathBuilder } from '../src/shared/helpers/file-path.helpers';
import { JwtStrategy } from '../src/shared/strategies/jwt.strategy';
import { UploadService } from '../src/upload/upload.service';
import { emptyDir } from './helpers/file.helper';
import { HttpServiceMock } from './mocks/http-service.mock';
import { FakeAuthGuardFactory } from './mocks/jwt-guard.mock';
import { EmptyLogger } from './mocks/logger.mock';

describe('UploadController (e2e)', () => {
  let app: INestApplication;
  let uploadService: UploadService;
  let httpMock = new HttpServiceMock();
  const tmpPath = pathBuilder(undefined, 'tmp');
  const diskPath = pathBuilder(undefined, 'disk');
  const cachePath = pathBuilder(undefined, 'cache');

  const fakeGuard = new FakeAuthGuardFactory();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigModule)
      .useValue(ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }))
      .overrideProvider(JwtStrategy)
      .useValue(null)
      .overrideGuard(JwtAuthGuard)
      .useValue(fakeGuard.getGuard())
      .overrideProvider(HttpService)
      .useValue(httpMock)
      .compile();
    app = moduleFixture.createNestApplication();
    uploadService = app.get<UploadService>(UploadService);
    app.useLogger(new EmptyLogger());
    await app.init();
  });

  beforeEach(async () => {
    fakeGuard.setAuthResponse(true);
    httpMock.reset();
    await emptyDir(diskPath);
    await emptyDir(cachePath);
    await emptyDir(tmpPath);
  });

  afterAll(async () => {
    await emptyDir(diskPath);
    await emptyDir(cachePath);
    await emptyDir(tmpPath);
    await app.close();
  });

  describe('/upload/image (POST)', () => {
    describe('Positive Tests', () => {
      it('Should accept jpg', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .post('/upload/image')
          .set('Authorization', 'Bearer Mock')
          .attach('image', join(process.cwd(), 'test', 'helpers', 'test.jpg'));
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.CREATED);
        expect(readdirSync(tmpPath).length).toEqual(1);
      });
      it('Should accept png', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .post('/upload/image')
          .set('Authorization', 'Bearer Mock')
          .attach('image', join(process.cwd(), 'test', 'helpers', 'test.png'));
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.CREATED);
        expect(readdirSync(tmpPath).length).toEqual(1);
      });
      it('Should accept oversized images', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .post('/upload/image')
          .set('Authorization', 'Bearer Mock')
          .attach(
            'image',
            join(process.cwd(), 'test', 'helpers', 'test-oversized.png'),
          );
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.CREATED);
        expect(readdirSync(tmpPath).length).toEqual(1);
      });
      it('Should notify the auth backend about upload', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .post('/upload/image')
          .set('Authorization', 'Bearer Mock')
          .attach(
            'image',
            join(process.cwd(), 'test', 'helpers', 'test-oversized.png'),
          );
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.CREATED);
        expect(readdirSync(tmpPath).length).toEqual(1);
        expect(httpMock.params.length).not.toEqual(0);
      });
      it('Should clean temporary image storage when uploading image', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .post('/upload/image')
          .attach(
            'image',
            join(process.cwd(), 'test', 'helpers', 'test-oversized.png'),
          );
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.CREATED);
        expect(readdirSync(cachePath).length).toEqual(0);
      });
      it('Should return correct hash', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .post('/upload/image')
          .set('Authorization', 'Bearer Mock')
          .attach('image', join(process.cwd(), 'test', 'helpers', 'test.png'));
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.CREATED);
        const imagePath = res.body.path;
        expect(existsSync(join(tmpPath, imagePath))).toEqual(true);
      });
      // File size limitation not tested for obvious reasons
    });
    describe('Negative Tests', () => {
      it('Should fail for invalid file types', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .post('/upload/image')
          .attach('image', './test/helpers/test.txt');
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(res.body.message.startsWith('Unsupported Filetype')).toEqual(
          true,
        );
      });
      it('Should fail for unauthorized user', async () => {
        // ASSERT
        fakeGuard.setAuthResponse(false);
        // ACT
        const res = await request(app.getHttpServer())
          .post('/upload/image')
          .set('Authorization', 'Bearer Mock')
          .attach('image', join(process.cwd(), 'test', 'helpers', 'test.jpg'));
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.FORBIDDEN);
      });
      it('Should detect duplicates', async () => {
        // ASSERT
        // Copy file to disk folder
        const fileHash = await uploadService.hashFile(
          join(process.cwd(), 'test', 'helpers', 'test.png'),
        );
        copyFileSync(
          join(process.cwd(), 'test', 'helpers', 'test.png'),
          join(tmpPath, `${fileHash}.png`),
        );
        // ACT
        const res = await request(app.getHttpServer())
          .post('/upload/image')
          .set('Authorization', 'Bearer Mock')
          .attach('image', join(process.cwd(), 'test', 'helpers', 'test.png'));
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.CONFLICT);
        expect(res.body.path).toEqual(`${fileHash}.png`);
        expect(readdirSync(tmpPath).length).toEqual(1);
      });
      it('Should fail if auth backend could not be notified', async () => {
        // ASSERT
        httpMock.shouldFail = true;
        // ACT
        const res = await request(app.getHttpServer())
          .post('/upload/image')
          .set('Authorization', 'Bearer Mock')
          .attach(
            'image',
            join(process.cwd(), 'test', 'helpers', 'test-oversized.png'),
          );
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.SERVICE_UNAVAILABLE);
        // Image for failed upload should not be persisted
        expect(readdirSync(tmpPath).length).toEqual(0);
      });
    });
  });
});
