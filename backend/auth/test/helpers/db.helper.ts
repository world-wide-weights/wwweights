import { faker } from '@faker-js/faker';
import { hash } from 'bcrypt';
import {
  DataSource,
  DeleteResult,
  InsertResult,
  Repository,
  UpdateResult,
} from 'typeorm';
import { ImageUserLookupEntity } from '../../src/db/entities/image-user-lookup.entity';
import { UserEntity } from '../../src/db/entities/users.entity';
import { ROLES } from '../../src/shared/enums/roles.enum';
import { STATUS } from '../../src/shared/enums/status.enum';

/**
 * @description Create user in provided datasource. Use defaults that can be overwritten
 */
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

/**
 * @description Delete user by attribute
 */
export async function deleteUserByAttribute(
  dataSource: DataSource,
  identifier: Partial<UserEntity>,
): Promise<DeleteResult> {
  return await getRepository<UserEntity>(dataSource, UserEntity).delete(
    identifier,
  );
}

/**
 * @description Update user by attribute
 */
export async function updateUserByAttribute(
  dataSource: DataSource,
  identifier: Partial<UserEntity>,
  updateValue: Partial<UserEntity>,
): Promise<UpdateResult> {
  return await getRepository<UserEntity>(dataSource, UserEntity).update(
    identifier,
    updateValue,
  );
}

/**
 * @description Fetch user by attribute
 */
export async function getUserByAttribute(
  dataSource: DataSource,
  identifier: Partial<UserEntity>,
): Promise<UserEntity> {
  return await getRepository<UserEntity>(dataSource, UserEntity).findOneBy(
    identifier,
  );
}

/**
 * @description Get user <-> image lookup by userId
 */
export async function getLookupsByUserId(
  dataSource: DataSource,
  fkUserId: number,
): Promise<ImageUserLookupEntity[]> {
  return await getRepository<ImageUserLookupEntity>(
    dataSource,
    ImageUserLookupEntity,
  ).findBy({ fkUserId });
}

/**
 * @description Insert user <-> image lookup
 */
export async function createLookup(
  dataSource: DataSource,
  lookup: ImageUserLookupEntity,
): Promise<InsertResult> {
  return await getRepository<ImageUserLookupEntity>(
    dataSource,
    ImageUserLookupEntity,
  ).insert(lookup);
}

/**
 * @description Get Repository for Entity
 */
function getRepository<T>(dataSource, entity): Repository<T> {
  return dataSource.getRepository(entity) as Repository<T>;
}
