import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './db.service';
import { UserEntity } from './entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService],
  exports: [UserService],
})
export class DbModule {}
