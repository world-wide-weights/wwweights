import { UserEntity } from '../../src/db/entities/users.entity';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { STATUS } from '../../src/shared/enums/status.enum';
import { ROLES } from '../../src/shared/enums/roles.enum';
import { DataSource, Repository } from 'typeorm';

export async function createUser(
  dataSource: DataSource,
  valueOverride?: Partial<UserEntity>,
): Promise<UserEntity> {
  const user: Partial<UserEntity> = {
    username: faker.lorem.word(),
    password: faker.lorem.word(),
    email: faker.internet.email(),
    status: STATUS.UNVERIFIED,
    role: ROLES.USER,
  };
  Object.assign(user, valueOverride);
  user.password = await bcrypt.hash(user.password, 10);
  return (await getRepository<UserEntity>(dataSource, UserEntity).insert(user))
    .generatedMaps[0] as UserEntity;
}

export async function deleteByAttribute(
  dataSource: DataSource,
  identifier: Partial<UserEntity>,
) {
  return await getRepository<UserEntity>(dataSource, UserEntity).delete(
    identifier,
  );
}

export async function updateByAttribute(
  dataSource: DataSource,
  identifier: Partial<UserEntity>,
  updateValue: Partial<UserEntity>,
) {
  return await getRepository<UserEntity>(dataSource, UserEntity).update(
    identifier,
    updateValue,
  );
}
export async function getUserByAttribute(
  dataSource: DataSource,
  identifier: Partial<UserEntity>,
) {
  return await getRepository<UserEntity>(dataSource, UserEntity).findOneBy(
    identifier,
  );
}

function getRepository<T>(dataSource, entity): Repository<T> {
  return dataSource.getRepository(entity) as Repository<T>;
}
