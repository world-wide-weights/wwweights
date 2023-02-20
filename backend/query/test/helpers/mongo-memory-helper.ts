import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

/**
 * @description Get typegoose module using the in memory mongo server
 */
export const initializeMockModule = () =>
  TypegooseModule.forRootAsync({
    useFactory: async () => {
      mongod = await MongoMemoryServer.create();
      const mongoUri = await mongod.getUri();
      return {
        uri: mongoUri,
      };
    },
  });

/**
 * @description Close in memory mongodb instance
 */
export async function teardownMockDataSource() {
  await mongod.stop();
}
