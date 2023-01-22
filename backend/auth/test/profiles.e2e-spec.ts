/* eslint-disable prettier/prettier */
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from 'src/db/entities/users.entity';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { UserService } from '../src/db/services/user.service';
import { createUser, deleteByAttribute } from './helpers/db.helper';
import { SAMPLE_USER } from './helpers/sample-data.helper';
import { setupDataSource } from './helpers/typeOrmSetup';

describe('ProfilesController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let userService: UserService;
  let authService: AuthService;

  beforeEach(async () => {
    dataSource = await setupDataSource();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    authService = app.get<AuthService>(AuthService);
    userService = app.get<UserService>(UserService);

    await app.init();

    // Mock value for Db time as this value is not available
    jest
      .spyOn(userService, 'getCurrentDbTime')
      .mockImplementation(async () => ({
        now: new Date(Date.now()).toISOString(),
      }));
  });

  afterEach(async () => {
    await app.close();
  });
  describe('/profile/me', () => {
    let jwtToken: string;
    let user: UserEntity;
    beforeEach(async () => {
      user = await createUser(dataSource, SAMPLE_USER);
      jwtToken = (await authService.getAuthPayload(user)).access_token;
    });
    afterEach(async () => {
      await deleteByAttribute(dataSource, { pkUserId: user.pkUserId });
    });
    describe('Positive Tests', () => {
      it('Should return current logged in users profile', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .get('/profile/me')
          .set('Authorization', `Bearer ${jwtToken}`);
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.body.username).toEqual(SAMPLE_USER.username);
      });
      it('Should return profile including private fields', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .get('/profile/me')
          .set('Authorization', `Bearer ${jwtToken}`);
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.body.email).toEqual(SAMPLE_USER.email);
      });
    });
    describe('Negative Tests', () => {
      it('Should not be accessible without auth', async () => {
        // ACT
        const res = await request(app.getHttpServer()).get('/profile/me');
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      });

      it('Should not be accessible with invalid auth', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .get('/profile/me')
          .set('Authorization', `Bearer ${jwtToken}a`);
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('/profile/:userId', () => {
    let jwtToken: string;
    let user: UserEntity;
    beforeEach(async () => {
      user = await createUser(dataSource, SAMPLE_USER);
      const loggedInUser = await createUser(dataSource, {
        username: 'abc',
        password: 'abc',
        email: 'abc@abc.abc',
      });
      jwtToken = (await authService.getAuthPayload(loggedInUser)).access_token;
    });
    afterEach(async () => {
      await deleteByAttribute(dataSource, { pkUserId: user.pkUserId });
    });

    describe('Positive Tests', () => {
      it('Should fetch user profile by id', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .get(`/profile/${user.pkUserId}`)
          .set('Authorization', `Bearer ${jwtToken}`);
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.body.username).toEqual(SAMPLE_USER.username);
      });
      it('Should ommit private field from profile', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .get(`/profile/${user.pkUserId}`)
          .set('Authorization', `Bearer ${jwtToken}`);
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.body).not.toHaveProperty('email');
      });
    });
    describe('Negative Tests', () => {
      it('Should not be accessible without auth', async () => {
        // ACT
        const res = await request(app.getHttpServer()).get(
          `/profile/${user.pkUserId}`,
        );
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      });

      it('Should not be accessible with invalid auth', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .get(`/profile/${user.pkUserId}`)
          .set('Authorization', `Bearer ${jwtToken}a`);
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      });
      it('Should fail for invalid userId', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .get(`/profile/${user.pkUserId + 100}`)
          .set('Authorization', `Bearer ${jwtToken}`);
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
      });
    });
  });
});
