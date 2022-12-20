import { MongoMemoryServer } from 'mongodb-memory-server';
import { DataSource } from 'typeorm';
import { Item } from '../../src/models/item.model';

let mongod: MongoMemoryServer;
let dataSource: DataSource;

export async function initializeMockDataSource() {
  mongod = await MongoMemoryServer.create({});
  const mongoUri = await mongod.getUri();
  dataSource = new DataSource({
    type: 'mongodb',
    url: mongoUri,
    entities: [Item],
    synchronize: true,
    useUnifiedTopology: true,
  });
  await dataSource.initialize();
  await dataSource.synchronize();
  return dataSource;
}

export async function teardownMockDataSource() {
  await dataSource.destroy();
  await mongod.stop();
}
