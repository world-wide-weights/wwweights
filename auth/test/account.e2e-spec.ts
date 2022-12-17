import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { MailVerifyJWTDTO } from 'src/account/dtos/mail-jwt-payload.dto';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { createUser } from './helpers/db.helper';
import { SAMPLE_USER } from './helpers/sample-data.helper';
import { setupDataSource } from './helpers/typeOrmSetup';

describe('AccountController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let dataSource: DataSource;
  let configService: ConfigService;

  beforeEach(async () => {
    dataSource = await setupDataSource();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .compile();

    app = moduleFixture.createNestApplication();
    jwtService = await app.get<JwtService>(JwtService);
    configService = await app.get<ConfigService>(ConfigService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });
  describe('/account/resend-verification-email (GET)', () => {
    it('should return OK for valid JWT', async () => {
      // ARRANGE
      const user = await createUser(dataSource, SAMPLE_USER);
      const token = jwtService.sign({ id: user.pkUserId } as MailVerifyJWTDTO)
      // ACT
      const res = await request(app.getHttpServer())
        .get('/account/resend-verification-email')
        .set('Authorization', `Bearer ${token}`);
      // ASSERT
      expect(res.statusCode).toEqual(HttpStatus.OK)
    });
    it('should fail without JWT', () => {
      // ACT & ASSERT
      return request(app.getHttpServer())
        .get('/account/resend-verification-email')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
