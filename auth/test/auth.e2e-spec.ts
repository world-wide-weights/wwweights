/* eslint-disable prettier/prettier */
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../src/db/db.service';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import {
  createUser,
  deleteByAttribute,
  getUserByAttribute,
  updateByAttribute,
} from './helpers/db.helper';
import { setupDataSource } from './helpers/typeOrmSetup';
import { comparePassword } from './helpers/general.helper';
import { RefreshJWTPayload } from '../src/shared/dtos/refresh-jwt-payload.dto';
import { STATUS } from '../src/shared/enums/status.enum';
import configuration from './__mocks__/configuration';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let jwtService: JwtService;
  let configService: ConfigService;
  let userService: UserService;
  const SAMPLE_USER = {
    username: 'R2D2',
    password: 'StarWarsIsAVeryNiceMovie',
    email: 'r2d2@jedi.temple',
  };

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

  describe('/auth/signup (POST)', () => {
    it('Should accept valid DTO ', () => {
      // ACT & ASSERT
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(SAMPLE_USER)
        .expect(201);
    });

    it('Should write to DB ', async () => {
      // ACT
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(SAMPLE_USER);

      // ASSERT
      expect(res.statusCode).toEqual(HttpStatus.CREATED)
      const user = await getUserByAttribute(dataSource, { email: SAMPLE_USER.email });
      expect(user.email).toEqual(SAMPLE_USER.email);
      expect(user.username).toEqual(SAMPLE_USER.username);
      expect(comparePassword(SAMPLE_USER.password, user.password)).toEqual(
        true,
      );
    });

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

  describe('/auth/login (POST)', () => {
    it('Should fail for incorrect data ', () => {
      // ACT & ASSERT
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          password: 'StarWarsIsAVeryNiceMovie',
          email: 'r2d2@jedi.temple',
        })
        .expect(401);
    });

    it('Should return token for correct data ', async () => {
      // ARRANGE
      await createUser(dataSource, SAMPLE_USER);
      // ACT
      const res = await request(app.getHttpServer()).post('/auth/login').send({
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
      const timeValue = new Date(Date.now())
        // Mock value for Db time as this value is not available
      jest
        .spyOn(userService, 'getCurrentDbTime')
        .mockImplementation(async () => ({
          now: timeValue.toISOString()
        }));
      // ACT
      const res = await request(app.getHttpServer()).post('/auth/login').send({
        password: SAMPLE_USER.password,
        email: SAMPLE_USER.email,
      });
      // ASSERT
      expect(res.statusCode).toEqual(HttpStatus.OK);
      const userInDb = await getUserByAttribute(dataSource, {email: SAMPLE_USER.email}) 
      expect(userInDb.lastLogin).toEqual(timeValue)
    });

    it('Should fail for banned user', async () => {
       // ARRANGE
       await createUser(dataSource, {...SAMPLE_USER, status: STATUS.BANNED});
       // ACT
       const res = await request(app.getHttpServer()).post('/auth/login').send({
         password: SAMPLE_USER.password,
         email: SAMPLE_USER.email,
       });
       // ASSERT
       expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    })

    it('Should return token that can be validated with public key', async () => {
      // ARRANGE
      await createUser(dataSource, SAMPLE_USER);
      // ACT
      const res = await request(app.getHttpServer()).post('/auth/login').send({
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

  describe('/auth/refresh (POST)', () => {
    let token;
    beforeEach(async () => {
      const user = await createUser(dataSource, SAMPLE_USER);
      token = jwtService.sign({
        id: user.pkUserId,
        email: user.email,
      } as RefreshJWTPayload);
    });
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


  describe('Test of the entire flow', () => {
    it('should allow for the user to create an account, login with credentials and then login with refresh token', async () =>{
      // ACT 1
      const signupRes = await request(app.getHttpServer()).post('/auth/signup').send(SAMPLE_USER)
      // ASSERT 1
      expect(signupRes.statusCode).toEqual(HttpStatus.CREATED)
      // ACT 2
      const loginRes = await request(app.getHttpServer()).post('/auth/login').send({email: SAMPLE_USER.email, password: SAMPLE_USER.password})
      // ASSERT 2
      expect(loginRes.statusCode).toEqual(HttpStatus.OK)
      // ACT 3
      const refreshRes = await request(app.getHttpServer()).post('/auth/refresh').set('Authorization', `Bearer ${loginRes.body.refresh_token}`)
      // ASSERT 3
      expect(refreshRes.statusCode).toEqual(HttpStatus.OK)
    })
  })
});
