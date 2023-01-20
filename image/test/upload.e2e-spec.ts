import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UploadService } from '../src/upload/upload.service';
import * as request from 'supertest';
import * as fs from 'fs';
import { emptyDir } from './helpers/file.helper';
import { JwtAuthGuard } from '../src/shared/guards/jwt.guard';
import { FakeAuthGuardFactory } from './mocks/jwt-guard.mock';
import * as path from 'path';

describe('UploadController (e2e)', () => {
  let app: INestApplication;
  let uploadService: UploadService;
  const fakeGuard = new FakeAuthGuardFactory();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigModule)
      .useValue(ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }))
      .overrideGuard(JwtAuthGuard)
      .useValue(fakeGuard.getGuard())
      .compile();
    app = moduleFixture.createNestApplication();
    uploadService = app.get<UploadService>(UploadService);
    await app.init();
    fakeGuard.setAuthResponse(true);
    await emptyDir(uploadService['pathBuilder'](undefined, 'disk'));
    await emptyDir(uploadService['pathBuilder'](undefined, 'cache'));
  });

  afterEach(async () => {
    await emptyDir(uploadService['pathBuilder'](undefined, 'disk'));
    await emptyDir(uploadService['pathBuilder'](undefined, 'cache'));
    await app.close();
  });

  describe('/upload/image (POST)', () => {
    describe('Positive Tests', () => {
      it('Should accept jpg', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .post('/upload/image')
          .attach(
            'image',
            path.join(process.cwd(), 'test', 'helpers', 'test.jpg'),
          );
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.CREATED);
        expect(
          fs.readdirSync(uploadService['pathBuilder'](undefined, 'disk'))
            .length,
        ).toEqual(1);
      });
      it('Should accept png', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .post('/upload/image')
          .attach(
            'image',
            path.join(process.cwd(), 'test', 'helpers', 'test.png'),
          );
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.CREATED);
        expect(
          fs.readdirSync(uploadService['pathBuilder'](undefined, 'disk'))
            .length,
        ).toEqual(1);
      });
      it('Should accept oversized images', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .post('/upload/image')
          .attach(
            'image',
            path.join(process.cwd(), 'test', 'helpers', 'test-oversized.png'),
          );
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.CREATED);
        expect(
          fs.readdirSync(uploadService['pathBuilder'](undefined, 'disk'))
            .length,
        ).toEqual(1);
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
          .attach(
            'image',
            path.join(process.cwd(), 'test', 'helpers', 'test.jpg'),
          );
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.FORBIDDEN);
      });
      it('Should detect duplicates', async () => {
        // ASSERT
        // Copy file to disk folder
        const fileHash = await uploadService.hashFile(
          path.join(process.cwd(), 'test', 'helpers', 'test.png'),
        );
        fs.copyFileSync(
          path.join(process.cwd(), 'test', 'helpers', 'test.png'),
          path.join(
            uploadService['pathBuilder'](undefined, 'disk'),
            `${fileHash}.png`,
          ),
        );
        // ACT
        const res = await request(app.getHttpServer())
          .post('/upload/image')
          .attach(
            'image',
            path.join(process.cwd(), 'test', 'helpers', 'test.png'),
          );
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.CONFLICT);
        expect(res.body.location).toEqual(`${fileHash}.png`);
        expect(
          fs.readdirSync(uploadService['pathBuilder'](undefined, 'disk'))
            .length,
        ).toEqual(1);
      });
    });
  });
});
