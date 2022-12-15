import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DbModule } from '../db/db.module';
import { SharedModule } from '../shared/shared.module';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [DbModule, SharedModule, AccountModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
