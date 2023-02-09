import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AccountModule } from '../src/account/account.module';
import { AuthModule } from '../src/auth/auth.module';
import { AuthService } from '../src/auth/auth.service';
import { DbModule } from '../src/db/db.module';
import { UserEntity } from '../src/db/entities/users.entity';
import { UserService } from '../src/db/services/user.service';
import { SharedModule } from '../src/shared/shared.module';
import {
  createLookup,
  createUser,
  getLookupsByUserId,
} from './helpers/db.helper';
import { SAMPLE_USER } from './helpers/sample-data.helper';
import { setupDataSource } from './helpers/typeOrmSetup';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let configService: ConfigService;
  let userService: UserService;
  let authService: AuthService;
  let user: UserEntity;
  let jwtToken: string;

  beforeEach(async () => {
    dataSource = await setupDataSource();
    process.env.API_KEYS = 'abc,def';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        ConfigModule.forRoot({ isGlobal: true }),
        DbModule,
        SharedModule,
        AccountModule,
        AuthModule,
      ],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .compile();

    app = await moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    configService = app.get<ConfigService>(ConfigService);
    userService = app.get<UserService>(UserService);
    authService = app.get<AuthService>(AuthService);

    await app.init();

    // Mock value for Db time as this value is not available
    jest
      .spyOn(userService, 'getCurrentDbTime')
      .mockImplementation(async () => ({
        now: new Date(Date.now()).toISOString(),
      }));
    user = await createUser(dataSource, SAMPLE_USER);
    jwtToken = (await authService.getAuthPayload(user)).access_token;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/account/add-image (POST)', () => {

    describe('Positive Tests', () => {
      it('Should add entry for user without image', async () => {
        // ARRANGE
        const hash = 'abcdefg.png';
        // ACT
        const res = await request(app.getHttpServer())
          .post('/account/add-image')
          .set('Authorization', `Bearer ${jwtToken}`)
          .set('x-api-key', 'abc')
          .send({
            imageHash: hash,
          });
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.CREATED);
        const entries = await getLookupsByUserId(dataSource, user.pkUserId);
        expect(entries.length).toEqual(1);
        expect(entries[0].imageHash).toEqual(hash);
      });
      it('Should add entry for user with preexisting image', async () => {
        // ARRANGE
        const hash = 'abcdefg.png';
        await createLookup(dataSource, {
          imageHash: 'previous.jpg',
          fkUserId: user.pkUserId,
        });
        // ACT
        const res = await request(app.getHttpServer())
          .post('/account/add-image')
          .set('Authorization', `Bearer ${jwtToken}`)
          .set('x-api-key', 'abc')
          .send({
            imageHash: hash,
          });
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.CREATED);
        const entries = await getLookupsByUserId(dataSource, user.pkUserId);
        expect(entries.length).toEqual(2);
      });
      it('Should not add duplicate (user, image) combination', async () => {
        // ARRANGE
        const hash = 'abcdefg.png';
        await createLookup(dataSource, {
          imageHash: hash,
          fkUserId: user.pkUserId,
        });
        // ACT
        const res = await request(app.getHttpServer())
          .post('/account/add-image')
          .set('Authorization', `Bearer ${jwtToken}`)
          .set('x-api-key', 'abc')
          .send({
            imageHash: hash,
          });
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.CREATED);
        const entries = await getLookupsByUserId(dataSource, user.pkUserId);
        expect(entries.length).toEqual(1);
      });
    });

    describe('Negative Tests', () => {
      it('Should fail for no auth headers', async () => {
        // ACT
        const res = await request(app.getHttpServer()).post(
          '/account/add-image',
        );
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      });
      it('Should fail with "Forbidden" for valid JWT but invalid API key', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .post('/account/add-image')
          .set('Authorization', `Bearer ${jwtToken}`)
          .set('x-api-key', 'invalid');
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.FORBIDDEN);
      });
      it('Should fail for valid JWT but invalid API key', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .post('/account/add-image')
          .set('Authorization', `Bearer ${jwtToken}a`)
          .set('x-api-key', 'abc');
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      });
    });
  });
});
