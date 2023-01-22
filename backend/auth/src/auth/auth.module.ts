import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DbModule } from '../db/db.module';
import { SharedModule } from '../shared/shared.module';
import { PassportModule } from '@nestjs/passport';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [DbModule, SharedModule, PassportModule],
  providers: [AuthService, RefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
