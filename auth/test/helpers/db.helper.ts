import { UserEntity } from '../../src/db/entities/users.entity';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { STATUS } from '../../src/shared/enums/status.enum';
import { ROLES } from '../../src/shared/enums/roles.enum';
import { DataSource } from 'typeorm';

export async function createUser(
  dataSource: DataSource,
  valueOverride?: Partial<UserEntity>,
) {
  const user: Partial<UserEntity> = {
    username: faker.lorem.word(),
    password: faker.lorem.word(),
    email: faker.internet.email(),
    status: STATUS.UNVERIFIED,
    role: ROLES.USER,
  };
  Object.assign(user, valueOverride);
  user.password = await bcrypt.hash(user.password, 10)
  return (await dataSource.getRepository(UserEntity).insert(user))
    .generatedMaps;
}
