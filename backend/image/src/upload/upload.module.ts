import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { InternalCommunicationModule } from '../internal-communication/internal-communication.module';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dest:
          configService.get<string>('IMAGE_STORE_INCOMING_CACHE_PATH') ||
          './cache',
      }),
      inject: [ConfigService],
    }),
    InternalCommunicationModule,
  ],
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
