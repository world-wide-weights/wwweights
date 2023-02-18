import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

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

export async function teardownMockDataSource() {
  await mongod.stop({ force: true });
}
