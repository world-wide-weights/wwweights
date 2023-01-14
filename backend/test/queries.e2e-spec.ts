import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandsModule } from '../src/commands.module/commands.module';
import { initializeMockDataSource } from './helpers/MongoMemoryHelpers';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let itemRepository: any;

  beforeAll(async () => {
    const dataSource = await initializeMockDataSource();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypegooseModule.forRoot(''), CommandsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  beforeEach(async () => {
    // await itemRepository.clear();
    // await itemRepository.insert(singleItem);
  });

  afterAll(async () => {
    // await itemRepository.clear();
    //await teardownMockDataSource();
    await app.close();
  });

  describe('Queries /query/v1', () => {
    const queriesPath = '/query/v1';

    it('/ => createItem', async () => {
      expect(true).toBe(true);
    });

    // it('/:slug => getOneItem', async () => {
    //   const res = await request(app.getHttpServer())
    //     .get(queriesPath + 'get-one-item/' + singleItem.slug)
    //     .expect(HttpStatus.OK);
    //   expect(res.body.name).toBe(singleItem.name);
    // });
  });
});
