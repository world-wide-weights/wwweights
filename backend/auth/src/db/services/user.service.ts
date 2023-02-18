import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { UserEntity } from '../entities/users.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
  ) {}

  /**
   * @description Fetch one user based on email
   */
  async findOneByEmail(email: string): Promise<UserEntity> {
    return await this.userEntity.findOneBy({ email: email });
  }

  /**
   * @description Fetch one user based on id
   */
  async findOneById(id: number): Promise<UserEntity> {
    return await this.userEntity.findOneBy({ pkUserId: id });
  }

  /**
   * @description Set user last login time to current time (based on db system time)
   */
  async setLoginTimestamp(id: number): Promise<void> {
    const dbTime = await this.getCurrentDbTime();
    // Use postgres function to get the current timestamp. This allows for consistent time measurements even with multiple auth services running
    await this.userEntity.update(id, {
      lastLogin: dbTime.now,
    });
  }

  /**
   * @description Insert user and handle constraint violations
   */
  async insertUser(userData: Partial<UserEntity>): Promise<UserEntity> {
    try {
      const user = this.userEntity.create(userData);
      // This is a non ideal way of inserting the date, especially since postgres already has a default value
      // However pg-mem has imperfections in the SQL parser that force us to set the createdAt date on the server rather than in the db directly
      // This problem is related to https://github.com/oguimbal/pg-mem/issues/239
      const insertedUser = await this.userEntity.save({
        ...user,
        createdAt: await (await this.getCurrentDbTime()).now,
      });
      return insertedUser;
    } catch (error) {
      this.logger.error(error);
      // Necessary due to incomplete typeorm type
      if (error instanceof QueryFailedError && 'code' in error) {
        if (error.code === '23505') {
          // Only if there is a constraint a specified conflict can be thrown, otherwise throw unspecified conflict
          if ('constraint' in error) {
            if (error.constraint === 'username_unique') {
              throw new ConflictException('Username already in use');
            }
            if (error.constraint === 'email_unique') {
              throw new ConflictException('Email already in use');
            }
          }
          throw new ConflictException('Unknown conflict');
        }
      }
      throw error;
    }
  }

  /**
   * @description Get the system time of postgres instance
   */
  // ignore this in tests as the SQL query is not supported by pg-mem i.e. it has to be mocked
  /* istanbul ignore next */
  async getCurrentDbTime(): Promise<{ now: string }> {
    return (await this.userEntity.query('SELECT NOW()::timestamptz'))[0];
  }

  /**
   * @description Get the total amount of registered users in DB
   */
  async getUserCount(): Promise<number> {
    return await this.userEntity.count();
  }
}
