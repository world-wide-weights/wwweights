import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { MailVerifyJWTDTO } from '../src/account/dtos/mail-jwt-payload.dto';
import { VerifyEmailData } from '../src/mail/interfaces/email-verify-mail.interface';
import { MailService } from '../src/mail/mail.service';
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
  let mailService: MailService;

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
    mailService = await app.get<MailService>(MailService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });
  describe('/account/resend-verification-email (GET)', () => {
    describe('Positive Tests', () => {
      it('Should return OK for valid JWT', async () => {
        // ARRANGE
        const user = await createUser(dataSource, SAMPLE_USER);
        const token = jwtService.sign({
          id: user.pkUserId,
        } as MailVerifyJWTDTO);
        // ACT
        const res = await request(app.getHttpServer())
          .get('/account/resend-verification-email')
          .set('Authorization', `Bearer ${token}`);
        // ASSERT
        expect(res.statusCode).toEqual(HttpStatus.OK);
      });
      it('Should send verify email', async () => {
        // ARRANGE
        const user = await createUser(dataSource, SAMPLE_USER);
        const token = jwtService.sign({
          id: user.pkUserId,
        } as MailVerifyJWTDTO);
        const serviceSpy = jest.spyOn(mailService, 'sendMail');
        // ACT
        await request(app.getHttpServer())
          .get('/account/resend-verification-email')
          .set('Authorization', `Bearer ${token}`);
        // ASSERT
        expect(serviceSpy).toHaveBeenCalled();
      });
      it('Should send valid verify code', async () => {
        // ARRANGE
        let mailData: VerifyEmailData;
        const user = await createUser(dataSource, SAMPLE_USER);
        const token = jwtService.sign({
          id: user.pkUserId,
        } as MailVerifyJWTDTO);
        const serviceSpy = jest
          .spyOn(mailService, 'sendMail')
          .mockImplementation(async (a, b, data: VerifyEmailData, c) => {
            mailData = data;
          });
        // ACT
        await request(app.getHttpServer())
          .get('/account/resend-verification-email')
          .set('Authorization', `Bearer ${token}`);
        // ASSERT
        expect(serviceSpy).toHaveBeenCalled();
        console.log(mailData.verifyLink);
        const verifyCode = new URL(mailData.verifyLink).searchParams.get(
          'code',
        );
        console.log(verifyCode);
        const codeContent = jwtService.verify(verifyCode, {
          secret: configService.get<string>('JWT_MAIL_VERIFY_SECRET'),
          algorithms: ['HS256'],
        });
        expect(codeContent).toEqual(
          expect.objectContaining({
            id: user.pkUserId
          }),
        );
      });
    });
    describe('Negative Tests', () => {
      it('Should fail without JWT', () => {
        // ACT & ASSERT
        return request(app.getHttpServer())
          .get('/account/resend-verification-email')
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });
  });
});
