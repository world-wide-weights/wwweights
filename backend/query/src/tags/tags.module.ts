import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Tag } from './models/tag.model';
import { QueryHandlers } from './queries';
import { TagsController } from './tags.controller';

@Module({
  imports: [CqrsModule, TypegooseModule.forFeature([Tag])],
  controllers: [TagsController],
  providers: [...QueryHandlers],
})
export class TagsModule {}
