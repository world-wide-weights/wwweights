import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { SharedModule } from '../shared/shared.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [SharedModule, MailModule],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
