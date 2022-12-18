import { TypeOrmModule } from '@nestjs/typeorm';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Item } from '../../src/models/item.model';

let mongod: MongoMemoryServer;

export const rootMongoTestModule = () =>
  TypeOrmModule.forRootAsync({
    useFactory: async () => {
      mongod = await MongoMemoryServer.create();
      const mongoUri = await mongod.getUri();
      return {
        type: 'mongodb',
        uri: mongoUri,
        synchronize: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        entities: [Item],
      };
    },
  });

export const closeInMongodConnection = async () => {
  if (mongod) await mongod.stop();
};
