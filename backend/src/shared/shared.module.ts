import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SharedController } from './shared.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  // JWT Module does not need parameter
  imports: [JwtModule.register({})],
  providers: [JwtStrategy],
  controllers: [SharedController]
})
export class SharedModule {}
