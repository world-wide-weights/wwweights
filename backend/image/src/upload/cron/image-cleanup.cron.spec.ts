import { ConfigService } from '@nestjs/config';
import { copyFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { emptyDir } from '../../../test/helpers/file.helper';
import { pathBuilder } from '../../shared/helpers/file-path.helpers';
import { ImageCleanup } from './image-cleanup.cron';

const timeout = (ms = 100) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

describe('ImageCron', () => {
  let imageCleanup: ImageCleanup;
  const tmpPath = pathBuilder(undefined, 'tmp');
  beforeAll(async () => {
    imageCleanup = new ImageCleanup(new ConfigService());
    await emptyDir(tmpPath);
  });

  afterEach(async () => {
    await emptyDir(tmpPath);
  });

  describe('cleanTmpStage', () => {
    it('Should remove files that exceeded ttl', async () => {
      // ARRANGE
      copyFileSync(
        join(process.cwd(), 'test', 'helpers', 'test.png'),
        join(tmpPath, `test.png`),
      );
      // Wait to exceed ttl
      await timeout(105);
      // ACT
      await imageCleanup.cleanTmpStage(100);
      // ASSERT
      expect(readdirSync(tmpPath).length).toEqual(0);
    });

    it('Should ignore files that did not exceeded ttl', async () => {
      // ARRANGE
      copyFileSync(
        join(process.cwd(), 'test', 'helpers', 'test.png'),
        join(tmpPath, `test.png`),
      );
      // ACT
      await imageCleanup.cleanTmpStage(1000);
      // ASSERT
      expect(readdirSync(tmpPath).length).toEqual(1);
    });

    it('Should do both', async () => {
      // ARRANGE
      copyFileSync(
        join(process.cwd(), 'test', 'helpers', 'test.png'),
        join(tmpPath, `test.png`),
      );
      await timeout(205);
      copyFileSync(
        join(process.cwd(), 'test', 'helpers', 'test.png'),
        join(tmpPath, `test1.png`),
      );
      // ACT
      await imageCleanup.cleanTmpStage(200);
      // ASSERT
      expect(readdirSync(tmpPath).length).toEqual(1);
    });
  });
});
