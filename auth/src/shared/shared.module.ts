import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        privateKey: configService.get<string>('JWT_PRIVATE_KEY'),
        algorithm: 'RS256',
        signOptions: {
          expiresIn: configService.get<number>('JWT_EXPIRE_TIME'),
          algorithm: 'RS256',
        },
      }),
    }),
  ],
  providers: [],
  exports: [JwtModule],
})
export class SharedModule {}
