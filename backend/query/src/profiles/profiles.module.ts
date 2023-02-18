import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Profile } from '../models/profile.model';
import { ProfilesController } from './profiles.controller';
import { QueryHandlers } from './queries';

@Module({
  imports: [CqrsModule, TypegooseModule.forFeature([Profile])],
  controllers: [ProfilesController],
  providers: [...QueryHandlers],
})
export class ProfilesModule {}
