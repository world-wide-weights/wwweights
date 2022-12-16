import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../src/db/db.service';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { createUser } from './helpers/db.helper';
import { setupDataSource } from './helpers/typeOrmSetup';

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
    const configModuleMock = ConfigModule.forRoot({
      envFilePath: './test/testing.env',
    });
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .overrideProvider(ConfigModule)
      .useValue(configModuleMock)
      .compile();

    app = await moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    jwtService = app.get<JwtService>(JwtService);
    configService = app.get<ConfigService>(ConfigService);
    userService = app.get<UserService>(UserService);

    await app.init();
  });

  describe('/auth/signup (POST)', () => {
    it('Should accept valid DTO (GET)', () => {
      // ACT & ASSERT
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(SAMPLE_USER)
        .expect(201);
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
    beforeEach(() => {
      // Mock value for Db time as this value is not available
      jest
        .spyOn(userService, 'getCurrentDbTime')
        .mockImplementation(async () => ({
          now: new Date(Date.now()).toISOString(),
        }));
    });
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
    });

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
});
