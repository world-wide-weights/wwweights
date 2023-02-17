import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { InternalCommunicationService } from './internal-communication.service';

@Module({
  imports: [HttpModule],
  providers: [InternalCommunicationService],
  exports: [InternalCommunicationService],
})
export class InternalCommunicationModule {}
