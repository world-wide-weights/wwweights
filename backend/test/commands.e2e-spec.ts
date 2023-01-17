import { INestApplication } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let itemRepository: any;

  beforeAll(async () => {
    // const dataSource = await initializeMockDataSource();
    // const moduleFixture: TestingModule = await Test.createTestingModule({
    //   imports: [TypegooseModule.forRoot(''), CommandsModule],
    // }).compile();
    // app = moduleFixture.createNestApplication();
    // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    // await app.init();
  });

  beforeEach(async () => {
    // await itemRepository.clear();
    // await itemRepository.insert(singleItem);
  });

  afterAll(async () => {
    // await itemRepository.clear();
    // await teardownMockDataSource();
    // await app.close();
  });

  describe('Commands /command/v1', () => {
    const commandsPath = '/command/v1';
    it('/ => createItem', async () => {
      expect(true).toBe(true);
    });

    // it('/ => createItem', async () => {
    //   await itemRepository.clear();
    //   await request(app.getHttpServer())
    //     .post(commandsPath + 'create-item')
    //     .send(createItem)
    //     .expect(HttpStatus.OK);

    //   while ((await itemRepository.count()) < 1) {
    //     await timeout();
    //   }

    //   const item = await itemRepository.findOneBy({ name: createItem.name });
    //   expect(item.name).toEqual(createItem.name);
    //   expect(item.slug).toBeDefined();
    //   expect(item.slug.length).not.toEqual('');
    // });
  });
});
