import { Module } from '@nestjs/common';
import {DbModule} from '../db/db.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [DbModule],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule {}
