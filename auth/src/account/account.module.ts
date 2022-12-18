import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from '../db/db.module';
import { SharedModule } from '../shared/shared.module';
import { MailModule } from '../mail/mail.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { MailVerifyJwtStrategy } from './strategies/mail-jwt.strategy';
import { ResetJwtStrategy } from './strategies/reset-jwt.strategy';

@Module({
  imports: [SharedModule, DbModule, MailModule, ConfigModule],
  providers: [AccountService, MailVerifyJwtStrategy, ResetJwtStrategy],
  controllers: [AccountController],
  exports: [AccountService]
})
export class AccountModule {}
