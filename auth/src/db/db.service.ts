import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { STATUS } from '../shared/enums/status.enum';
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

  async findOneById(id: number) {
    return await this.userEntity.findOneBy({ pkUserId: id });
  }

  async setLoginTimestamp(id: number) {
    const dbTime = await this.getCurrentDbTime();
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
      if (e instanceof QueryFailedError) {
        if ((e as any).code === '23505') {
          if ((e as any).constraint === 'username_unique') {
            throw new ConflictException('Username already in use');
          }
          if ((e as any).constraint === 'email_unique') {
            throw new ConflictException('Email already in use');
          }
          throw new ConflictException('Unknown conflict');
        }
      }
      throw e;
    }
  }
  async updatePassword(id: number, hash: string) {
    await this.userEntity.update({ pkUserId: id }, { password: hash });
  }

  async changeUserStatus(id: number, status: STATUS): Promise<void> {
    await this.userEntity.update(id, { status: status });
  }

  async getCurrentDbTime(): Promise<{ now: string }> {
    return (await this.userEntity.query('SELECT NOW()::timestamptz'))[0];
  }
}
