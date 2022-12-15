import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { STATUS } from '../shared/enums/status.enum';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/users.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
  ) {}

  async findOneByEmail(email: string) {
    return await this.userEntity.findOneBy({ email: email });
  }

  async findOneByUserName(username: string) {
    return await this.userEntity.findOneBy({ username: username });
  }

  async findOneById(id) {
    return await this.userEntity.findOneBy(id);
  }

  async setLoginTimestamp(id: number) {
    const dbTime = (
      await this.userEntity.query('SELECT NOW()::timestamptz')
    )[0];
    // Use postgres function to get the current timestamp. This allows for consistent time measurements even with multiple auth services running
    await this.userEntity.update(id, {
      lastLogin: dbTime.now,
    });
  }

  async insertNew(userData: Partial<UserEntity>): Promise<UserEntity> {
    try {
      const user = this.userEntity.create(userData);
      await this.userEntity.save(user);
      return user;
    } catch (e) {
      // TODO: Add catch for conflicts
      throw e;
    }
  }
  async updatePassword(id: number, hash: string) {
    await this.userEntity.update(id, { password: hash });
  }

  async changeUserStatus(id: number, status: STATUS): Promise<void> {
    await this.userEntity.update(id, { status: status });
  }
}
