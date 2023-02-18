import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GlobalStatistics } from '../models/global-statistics.model';
import { SharedService } from './shared.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  // JWT Module does not need parameter
  imports: [
    JwtModule.register({}),
    TypegooseModule.forFeature([GlobalStatistics]),
  ],
  providers: [JwtStrategy, SharedService],
  exports: [SharedService],
})
export class SharedModule {}
