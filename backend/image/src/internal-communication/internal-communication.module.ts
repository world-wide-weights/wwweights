import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { UploadModule } from '../upload/upload.module';
import { InternalCommunicationController } from './internal-communication.controller';
import { InternalCommunicationService } from './internal-communication.service';

@Module({
  imports: [HttpModule, forwardRef(() => UploadModule)],
  controllers: [InternalCommunicationController],
  providers: [InternalCommunicationService],
  exports: [InternalCommunicationService],
})
export class InternalCommunicationModule {}
