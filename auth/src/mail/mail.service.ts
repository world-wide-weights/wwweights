import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { retryBackoff } from 'backoff-rxjs';
import { render } from 'ejs';
import { readFile as _readFile } from 'fs';
import * as nodemailer from 'nodemailer';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { promisify } from 'util';

const readFile = promisify(_readFile);

@Injectable()
export class MailService {
  mailTransport: nodemailer.Transporter<any>;
  maxRetries: number;
  errorDelay: number;

  constructor(private readonly configService: ConfigService) {
    this.mailTransport = nodemailer.createTransport({
      host: configService.get<string>('MAIL_HOST'),
      port: configService.get<number>('MAIL_PORT'),
      pool: true,
      secure: false,
      auth: {
        user: configService.get<string>('MAIL_USERNAME'),
        pass: configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  private passToMailServerWithBackoff(recipient, subject, message) {
    of('Send Mail').pipe(
      switchMap(() =>
        this.mailTransport.sendMail({
          to: recipient,
          from: process.env.MAIL_ADRESS,
          subject: subject,
          html: message,
        }),
      ),
      retryBackoff({
        initialInterval: this.configService.get<number>('MAIL_ERROR_DELAY_MS'),
        maxRetries: this.configService.get<number>('MAIL_MAX_RETRIES'),
        backoffDelay(iteration, initialInterval) {
          // Not exponential in this case
          return iteration * initialInterval;
        },
      }),
    );
  }

  async sendMail<T>(
    recipient: string,
    template: string,
    mailData: T,
    subject: string,
  ): Promise<void> {
    const mailTemplate = await readFile(
      __dirname + '/templates/' + template + '.template.ejs',
      'utf-8',
    );
    const mailContent = render(mailTemplate, mailData as any);
    await this.passToMailServerWithBackoff(recipient, subject, mailContent);
  }
}
