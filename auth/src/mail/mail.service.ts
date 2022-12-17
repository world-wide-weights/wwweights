import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from 'ejs';
import { readFile as _readFile } from 'fs';
import * as nodemailer from 'nodemailer';
import { promisify } from 'util';

const readFile = promisify(_readFile);

@Injectable()
export class MailService {
  mailTransport: nodemailer.Transporter<any>;
  maxRetries: number;
  errorDelay: number;
  private logger = new Logger(MailService.name);

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

  private async passToMailserver(
    recipient: string,
    subject: string,
    message: string,
  ): Promise<void> {
    // Sleep helper func
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    let attempts = 0;
    while (attempts < this.configService.get<number>('MAIL_MAX_RETRIES')) {
      try {
        await this.mailTransport.sendMail({
          to: recipient,
          from: process.env.MAIL_ADRESS,
          subject: subject,
          html: message,
        });
      } catch (e) {
        attempts++;
        await delay(this.errorDelay);
        continue;
      }
      return;
    }
    // getting here means sending the mail is not possible
    this.logger.error('Sending mail not possible at this time');
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
    await this.passToMailserver(recipient, subject, mailContent);
  }
}
