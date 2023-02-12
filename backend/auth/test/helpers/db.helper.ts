import { faker } from '@faker-js/faker';
import { hash } from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import { ImageUserLookupEntity } from '../../src/db/entities/image-user-lookup.entity';
import { UserEntity } from '../../src/db/entities/users.entity';
import { ROLES } from '../../src/shared/enums/roles.enum';
import { STATUS } from '../../src/shared/enums/status.enum';

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
  user.password = await hash(user.password, 10);
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

export async function getLookupsByUserId(
  dataSource: DataSource,
  fkUserId: number,
) {
  return await getRepository<ImageUserLookupEntity>(
    dataSource,
    ImageUserLookupEntity,
  ).findBy({ fkUserId });
}

export async function createLookup(
  dataSource: DataSource,
  lookup: ImageUserLookupEntity,
) {
  return await getRepository<ImageUserLookupEntity>(
    dataSource,
    ImageUserLookupEntity,
  ).insert(lookup);
}

function getRepository<T>(dataSource, entity): Repository<T> {
  return dataSource.getRepository(entity) as Repository<T>;
}
