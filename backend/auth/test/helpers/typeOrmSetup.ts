import { newDb } from 'pg-mem';
import { DataSource } from 'typeorm';
import { ImageUserLookupEntity } from '../../src/db/entities/image-user-lookup.entity';
import { UserEntity } from '../../src/db/entities/users.entity';

export const setupDataSource = async () => {
  const db = newDb({
    autoCreateForeignKeyIndices: true,
  });

  // Necessary as this is the first function typeorm calls when connecting to a db
  db.public.registerFunction({
    implementation: () => 'auth',
    name: 'current_database',
  });

  // Necessary as this is the second function typeorm calls when connecting to a db
  db.public.registerFunction({
    implementation: () =>
      'PostgreSQL 15, compiled by Visual C++ build 1969, 64-bit',
    name: 'version',
  });

  const ds: DataSource = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: [UserEntity, ImageUserLookupEntity],
    migrationsRun: false,
  });
  await ds.initialize();
  await ds.synchronize();

  return ds;
};
