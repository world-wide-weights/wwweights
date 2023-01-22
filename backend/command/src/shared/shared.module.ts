import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  // JWT Module does not need parameter
  imports: [JwtModule.register({})],
  providers: [JwtStrategy],
})
export class SharedModule {}
