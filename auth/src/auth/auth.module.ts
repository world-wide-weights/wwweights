import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {SharedModule} from 'src/shared/shared.module';
import {JwtModule} from '@nestjs/jwt';
import {ConfigModule, ConfigService} from '@nestjs/config';

@Module({
	imports: [SharedModule, JwtModule.registerAsync({
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory: (configService: ConfigService) => ({
			secret: configService.get<string>('JWT_SECRET'),
			signOptions: {expiresIn: configService.get<string>('JWT_EXPIRE_TIME')}
		})
	})],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
