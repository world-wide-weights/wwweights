import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [DbModule],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
