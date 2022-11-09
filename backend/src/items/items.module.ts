import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './models/item.model';
import { ItemsController } from './items.controller';
import { ItemHandlers } from './queries/handlers';
import { CqrsModule } from '@nestjs/cqrs';
@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Item])],
  controllers: [ItemsController],
  providers: [...ItemHandlers],
})
export class ItemsModule {}
