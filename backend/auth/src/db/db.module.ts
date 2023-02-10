import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageUserLookupEntity } from './entities/image-user-lookup.entity';
import { UserEntity } from './entities/users.entity';
import { ImageUserLookupService } from './services/image-user-lookup.service';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ImageUserLookupEntity])],
  providers: [UserService, ImageUserLookupService],
  exports: [UserService, ImageUserLookupService],
})
export class DbModule {}
