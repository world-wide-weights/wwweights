/* eslint-disable prettier/prettier */
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as jwkToPem from 'jwk-to-pem';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { RefreshJWTPayload } from '../src/auth/dtos/refresh-jwt-payload.dto';
import { RsaJWK } from '../src/auth/responses/jwks.response';
import { UserService } from '../src/db/ user.service';
import { JWTPayload } from '../src/shared/dtos/jwt-payload.dto';
import { STATUS } from '../src/shared/enums/status.enum';
import {
  createUser,
  deleteByAttribute,
  getUserByAttribute,
  updateByAttribute,
} from './helpers/db.helper';
import { comparePassword } from './helpers/general.helper';
import { SAMPLE_USER } from './helpers/sample-data.helper';
import { setupDataSource } from './helpers/typeOrmSetup';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let jwtService: JwtService;
  let configService: ConfigService;
  let userService: UserService;

  beforeEach(async () => {
    dataSource = await setupDataSource();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .compile();

    app = await moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    jwtService = app.get<JwtService>(JwtService);
    configService = app.get<ConfigService>(ConfigService);
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

  describe('/auth/signup (POST)', () => {
    describe('Positive Tests', () => {
      it('Should accept valid DTO ', () => {
        // ACT & ASSERT
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send(SAMPLE_USER)
          .expect(HttpStatus.CREATED);
      });

      it('Should write to DB ', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(SAMPLE_USER);

        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.CREATED);
        const user = await getUserByAttribute(dataSource, {
          email: SAMPLE_USER.email,
        });
        expect(user.email).toEqual(SAMPLE_USER.email);
        expect(user.username).toEqual(SAMPLE_USER.username);
        expect(comparePassword(SAMPLE_USER.password, user.password)).toEqual(
          true,
        );
      });
    });
    describe('Negative Tests', () => {
      it('Should fail for incomplete payload', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .post('/auth/signup')
          .send({});
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      });

      it('Should fail for invalid email address input', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            ...SAMPLE_USER,
            email: 'notValidInput',
          });
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      });

      it('Should fail for password without sufficient length', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            ...SAMPLE_USER,
            password: 'short',
          });
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      });

      it('should fail for duplicate email', async () => {
        // ARRANGE
        await createUser(dataSource, { email: SAMPLE_USER.email });
        // ACT
        const res = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(SAMPLE_USER);

        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.CONFLICT);
      });

      it('should fail for duplicate username', async () => {
        // ARRANGE
        await createUser(dataSource, { username: SAMPLE_USER.username });
        // ACT
        const res = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(SAMPLE_USER);

        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.CONFLICT);
      });
    });
  });

  describe('/auth/login (POST)', () => {
    describe('Positive Tests', () => {
      it('Should return token for correct data ', async () => {
        // ARRANGE
        await createUser(dataSource, SAMPLE_USER);
        // ACT
        const res = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            password: SAMPLE_USER.password,
            email: SAMPLE_USER.email,
          });
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.body).toHaveProperty('access_token');
        expect(res.body).toHaveProperty('refresh_token');
      });

      it('Should update last login value in db ', async () => {
        // ARRANGE
        await createUser(dataSource, SAMPLE_USER);
        const timeValue = new Date(Date.now());
        // Mock value for Db time as this value is not available
        jest
          .spyOn(userService, 'getCurrentDbTime')
          .mockImplementation(async () => ({
            now: timeValue.toISOString(),
          }));
        // ACT
        const res = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            password: SAMPLE_USER.password,
            email: SAMPLE_USER.email,
          });
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.OK);
        const userInDb = await getUserByAttribute(dataSource, {
          email: SAMPLE_USER.email,
        });
        expect(userInDb.lastLogin).toEqual(timeValue);
      });
      it('Should return token that can be validated with public key', async () => {
        // ARRANGE
        await createUser(dataSource, SAMPLE_USER);
        // ACT
        const res = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            password: SAMPLE_USER.password,
            email: SAMPLE_USER.email,
          });
        // ASSERT
        const tokePayload = jwtService.verify(res.body.access_token, {
          publicKey: configService.get<string>('JWT_PUBLIC_KEY'),
          algorithms: ['RS256'],
        });
        expect(tokePayload).toEqual(
          expect.objectContaining({
            email: SAMPLE_USER.email,
            username: SAMPLE_USER.username,
          }),
        );
      });
    });
    describe('Negative Tests', () => {
      it('Should fail for incorrect data ', () => {
        // ACT & ASSERT
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            password: 'StarWarsIsAVeryNiceMovie',
            email: 'r2d2@jedi.temple',
          })
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('Should fail for banned user', async () => {
        // ARRANGE
        await createUser(dataSource, { ...SAMPLE_USER, status: STATUS.BANNED });
        // ACT
        const res = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            password: SAMPLE_USER.password,
            email: SAMPLE_USER.email,
          });
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('/auth/refresh (POST)', () => {
    let token;
    beforeEach(async () => {
      const user = await createUser(dataSource, SAMPLE_USER);
      token = jwtService.sign({
        id: user.pkUserId,
        email: user.email,
      } as RefreshJWTPayload);
    });
    describe('Positive Tests', () => {
      it('should allow for auth with valid token', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .post('/auth/refresh')
          .set('Authorization', `Bearer ${token}`);
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.body).toHaveProperty('access_token');
        expect(res.body).toHaveProperty('refresh_token');
      });
    });

    describe('Negative Tests', () => {
      it('should fail to auth with invalid token', async () => {
        // ACT
        const res = await request(app.getHttpServer())
          .post('/auth/refresh')
          .set('Authorization', `Bearer ${token}a`);
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      });

      it('should fail to auth for non existant user', async () => {
        // ARRANGE
        await deleteByAttribute(dataSource, { email: SAMPLE_USER.email });
        // ACT
        const res = await request(app.getHttpServer())
          .post('/auth/refresh')
          .set('Authorization', `Bearer ${token}a`);
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      });

      it('should fail to auth for banned user', async () => {
        // ARRANGE
        await updateByAttribute(
          dataSource,
          { email: SAMPLE_USER.email },
          { status: STATUS.BANNED },
        );
        // ACT
        const res = await request(app.getHttpServer())
          .post('/auth/refresh')
          .set('Authorization', `Bearer ${token}a`);
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('/auth/.well-known/jwks.json (GET)', function () {
    describe('Positive Tests', () => {
      it('Should contain a key entry for the base auth jwt', async () => {
        // ACT
        const res = await request(app.getHttpServer()).get(
          '/auth/.well-known/jwks.json',
        );
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.body).toHaveProperty('keys');
        const expectedItem = res.body.keys.find(
          (e) => e.kid === configService.get<string>('JWT_AUTH_KID'),
        );
        expect(expectedItem).toBeDefined();
      });

      it('Should return the complete key', async () => {
        // ACT
        const res = await request(app.getHttpServer()).get(
          '/auth/.well-known/jwks.json',
        );
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.OK);
        const expectedItem = res.body.keys.find(
          (e) => e.kid === configService.get<string>('JWT_AUTH_KID'),
        );
        expect(expectedItem).toMatchObject(new RsaJWK(expectedItem));
      });

      it('Should return key that verifies JWTs encrypted with the private key', async () => {
        // ARRANGE
        const user = await createUser(dataSource, SAMPLE_USER);
        const jwtToken = jwtService.sign({
          id: user.pkUserId,
          email: user.email,
        } as JWTPayload);
        // ACT
        const res = await request(app.getHttpServer()).get(
          '/auth/.well-known/jwks.json',
        );
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.OK);
        const expectedItem = res.body.keys.find(
          (e) => e.kid === configService.get<string>('JWT_AUTH_KID'),
        );
        const publickey = jwkToPem(expectedItem, { private: false });
        const tokenPayload = jwtService.verify(jwtToken, {
          publicKey: publickey,
          algorithms: ['RS256'],
        });
        expect(tokenPayload).toBeDefined();
      });
    });
  });
  describe('/auth/statistics (GET)', () => {
    describe('Positive Tests', () => {
    it('Should return the correct user amount', async() => {
      // ARRANGE
      await createUser(dataSource, SAMPLE_USER) 
      await createUser(dataSource, {...SAMPLE_USER, email: 'new.new@new.new', username: 'also very brand new'})
      // ACT
      const res = await request(app.getHttpServer()).get('/auth/statistics')
      // ASSERT
      expect(res.statusCode).toEqual(HttpStatus.OK)
      expect(res.body.totalUsers).toEqual(2)
    })
    it('Should return correct value with empty user table', async () => {
       // ACT
       const res = await request(app.getHttpServer()).get('/auth/statistics')
       // ASSERT
       expect(res.statusCode).toEqual(HttpStatus.OK)
       expect(res.body.totalUsers).toEqual(0)
    })
  })
  })

  describe('Test of the entire flow', () => {
    it('should allow for the user to create an account, login with credentials and then login with refresh token', async () => {
      // ACT 1
      const signupRes = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(SAMPLE_USER);
      // ASSERT 1
      expect(signupRes.statusCode).toEqual(HttpStatus.CREATED);
      // ACT 2
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: SAMPLE_USER.email, password: SAMPLE_USER.password });
      // ASSERT 2
      expect(loginRes.statusCode).toEqual(HttpStatus.OK);
      // ACT 3
      const refreshRes = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${loginRes.body.refresh_token}`);
      // ASSERT 3
      expect(refreshRes.statusCode).toEqual(HttpStatus.OK);
    });
  });
});
